#!/usr/bin/env python3
"""Fleet watchdog — runs on GitHub Actions (independent of Railway AND Azure).

Architecture it protects:
  Railway = primary compute + primary storage (always authoritative)
  Azure   = AI brains + durable mirror only (fail-open: apps never depend on it)

Checks, every run:
1. All 4 Railway services up (website, reddyfit, valdez, reddyhedge).
   Down -> auto-restart via Railway API (website: full redeploy from checkout).
2. Azure degradation (apps report azure_status) -> email heads-up; NO restart
   needed because the apps keep running on Railway local storage.
3. Blog freshness (Reddy Pulse pipeline health).
Emails on any problem; silent when all healthy.
"""

from __future__ import annotations

import datetime
import json
import os
import smtplib
import subprocess
import urllib.request
import sys
from email.mime.text import MIMEText

UA = {"User-Agent": "Mozilla/5.0 (compatible; ReddyFleetWatchdog/2.0)"}
PROJECT = "7832b39f-a42f-4203-b6e9-bd38699670de"
ENV = "b82a1ec2-33a3-4620-a142-82c9760affa2"

SERVICES = [
    # name, health URL, railway service id, redeploy mode
    ("website", "https://www.dandaakhilreddy.com/browse", "e37a4acb-67ad-4a46-b34d-6e85fe1e58b1", "tarball"),
    ("reddyfit", "https://bodyfatscanner-production.up.railway.app/api/health", "f9c21e6e-4fd5-4366-b3b5-b678e8a98a13", "restart"),
    ("valdez", "https://valdez-production.up.railway.app/api/health", "d5609171-a7a3-412d-8c27-d1de57c675f5", "restart"),
    ("reddyhedge", "https://reddyhedge-production.up.railway.app/api/health", "c7a2c2cf-c78c-4222-8791-4622aa812eaf", "restart"),
]

problems: list[str] = []
warnings: list[str] = []
actions: list[str] = []


def fetch(url: str, timeout: int = 25) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read()


def gql(query: str, variables: dict) -> dict:
    req = urllib.request.Request(
        "https://backboard.railway.com/graphql/v2",
        data=json.dumps({"query": query, "variables": variables}).encode(),
        headers={"Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
                 "Content-Type": "application/json", "x-railway-caller": "cli",
                 "User-Agent": UA["User-Agent"]})
    return json.loads(urllib.request.urlopen(req, timeout=60).read())


def restart_service(name: str, sid: str) -> None:
    r = gql("mutation($e:String!,$s:String!){ serviceInstanceRedeploy(environmentId:$e, serviceId:$s) }",
            {"e": ENV, "s": sid})
    if r.get("data"):
        actions.append(f"{name}: triggered Railway restart (serviceInstanceRedeploy)")
    else:
        raise RuntimeError(str(r.get("errors"))[:200])


def redeploy_website() -> None:
    subprocess.run(["tar", "czf", "/tmp/site.tar.gz", "--exclude=.git", "--exclude=apps", "."], check=True)
    url = (f"https://backboard.railway.com/project/{PROJECT}/environment/{ENV}/up"
           f"?serviceId={SERVICES[0][2]}")
    req = urllib.request.Request(url, data=open("/tmp/site.tar.gz", "rb").read(),
        headers={"Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
                 "Content-Type": "application/gzip", "x-railway-caller": "cli",
                 "User-Agent": UA["User-Agent"]})
    dep = json.loads(urllib.request.urlopen(req, timeout=180).read())
    actions.append(f"website: full redeploy {dep.get('deploymentId', '?')}")


def check_services() -> None:
    for name, url, sid, mode in SERVICES:
        try:
            status, body = fetch(url)
            if status != 200:
                raise RuntimeError(f"status {status}")
            if url.endswith("/api/health"):
                h = json.loads(body)
                if h.get("status") != "ok":
                    raise RuntimeError(f"health says {h.get('status')}")
                az = h.get("azure_status", "")
                if az.startswith("degraded"):
                    warnings.append(
                        f"{name}: AZURE DEGRADED ({h.get('azure_last_error')}). "
                        "App fine — running on Railway local storage. Fix Azure creds when convenient.")
        except Exception as exc:
            problems.append(f"{name} DOWN: {exc}")
            try:
                redeploy_website() if mode == "tarball" else restart_service(name, sid)
            except Exception as exc2:
                problems.append(f"{name}: auto-recovery FAILED: {exc2}")


def check_freshness() -> None:
    try:
        _, raw = fetch("https://www.dandaakhilreddy.com/blog/posts.json")
        latest = max(p["date"] for p in json.loads(raw))
        age = (datetime.date.today() - datetime.date.fromisoformat(latest)).days
        if age > 2:
            warnings.append(f"Blog stale: newest post {latest} ({age}d old) — check cloud pipelines.")
    except Exception as exc:
        problems.append(f"Cannot read blog feed: {exc}")


def alert(subject: str, lines: list[str]) -> None:
    msg = MIMEText("\n".join(lines))
    msg["Subject"] = subject
    msg["From"] = f"Reddy Fleet Watchdog <{os.environ['SMTP_USER']}>"
    msg["To"] = os.environ["NOTIFY_EMAIL"]
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=25) as s:
        s.starttls()
        s.login(os.environ["SMTP_USER"], os.environ["SMTP_PASS"])
        s.send_message(msg)
    print("alert emailed")


def main() -> int:
    check_services()
    check_freshness()
    if problems or warnings:
        subject = ("🚨 Fleet watchdog: service down" if problems
                   else "⚠️ Fleet watchdog: heads-up (all services up)")
        alert(subject,
              (["DOWN:"] + [f"• {p}" for p in problems] + [""] if problems else [])
              + (["Warnings:"] + [f"• {w}" for w in warnings] + [""] if warnings else [])
              + ([f"✔ {a}" for a in actions] if actions else []))
        print("problems:", problems, "warnings:", warnings)
        return 0
    print("fleet healthy — all 4 services up, blog fresh, azure ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
