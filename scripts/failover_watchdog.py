#!/usr/bin/env python3
"""Reddy Pulse / Project DANDA cloud watchdog.

Runs on GitHub Actions daily (machine-independent). Checks:
1. Site uptime — if down, triggers a Railway redeploy from the repo.
2. Blog freshness — if no post in the last 2 days, emails an alert.
Always emails on any failure; silent when healthy.
"""

from __future__ import annotations

import datetime
import json
import os
import smtplib
import subprocess
import sys
import urllib.request
from email.mime.text import MIMEText

SITE = "https://www.dandaakhilreddy.com"
UA = {"User-Agent": "Mozilla/5.0 (compatible; ReddyPulseWatchdog/1.0)"}
problems: list[str] = []
actions: list[str] = []


def fetch(url: str, timeout: int = 25) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read()


def check_uptime() -> bool:
    try:
        status, body = fetch(f"{SITE}/browse")
        if status == 200 and b"Akhil" in body:
            return True
        problems.append(f"Site responded abnormally (status {status}).")
    except Exception as exc:
        problems.append(f"Site unreachable: {exc}")
    return False


def check_freshness() -> None:
    try:
        _, raw = fetch(f"{SITE}/blog/posts.json")
        posts = json.loads(raw)
        latest = max(p["date"] for p in posts)
        latest_d = datetime.date.fromisoformat(latest)
        age = (datetime.date.today() - latest_d).days
        if age > 2:
            problems.append(
                f"Blog is stale: newest post is {latest} ({age} days old). "
                "The local pipeline likely hasn't run — open the Claude app so the "
                "scheduled tasks can fire, or run them manually.")
    except Exception as exc:
        problems.append(f"Could not read blog/posts.json from live site: {exc}")


def redeploy() -> None:
    """Redeploy the repo to Railway (site copy in the runner's checkout)."""
    subprocess.run(
        ["tar", "czf", "/tmp/site.tar.gz", "--exclude=.git", "--exclude=apps", "."],
        check=True)
    url = (f"https://backboard.railway.com/project/{os.environ['RAILWAY_PROJECT_ID']}"
           f"/environment/{os.environ['RAILWAY_ENV_ID']}/up"
           f"?serviceId={os.environ['RAILWAY_SERVICE_ID']}")
    req = urllib.request.Request(
        url, data=open("/tmp/site.tar.gz", "rb").read(),
        headers={"Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
                 "Content-Type": "application/gzip", "x-railway-caller": "cli",
                 "User-Agent": UA["User-Agent"].replace("compatible; ", "")})
    with urllib.request.urlopen(req, timeout=180) as r:
        dep = json.loads(r.read())
    actions.append(f"Triggered Railway redeploy: {dep.get('deploymentId', '?')}")


def alert(subject: str, lines: list[str]) -> None:
    body = "\n".join(lines)
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = f"Reddy Pulse Watchdog <{os.environ['SMTP_USER']}>"
    msg["To"] = os.environ["NOTIFY_EMAIL"]
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=25) as s:
        s.starttls()
        s.login(os.environ["SMTP_USER"], os.environ["SMTP_PASS"])
        s.send_message(msg)
    print("alert emailed")


def main() -> int:
    up = check_uptime()
    if not up:
        try:
            redeploy()
        except Exception as exc:
            problems.append(f"Auto-redeploy FAILED: {exc}")
    check_freshness()
    if problems:
        alert("⚠️ Reddy Pulse watchdog: attention needed",
              ["The cloud watchdog found issues:", ""]
              + [f"• {p}" for p in problems]
              + ([""] + [f"✔ {a}" for a in actions] if actions else []))
        print("problems:", problems)
        return 0  # alert sent; don't fail the workflow
    print("all healthy — site up, blog fresh")
    return 0


if __name__ == "__main__":
    sys.exit(main())
