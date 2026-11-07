#!/usr/bin/env python3
"""Reddy Pulse Daily Digest — emails Akhil the day's posts IN FULL so he can
learn from them without opening the site.

Contents: the 3 Reddy Pulse lanes (AI & Developers · Compute · Microsoft) with
AI-written key takeaways per post, full article text, sources — plus the day's
Project DANDA blueprint. Runs on GitHub Actions after both content pipelines.
Robust: missing Foundry -> no takeaways (still sends); no posts today -> sends
the most recent day instead; any single post failure never blocks the email.
"""

from __future__ import annotations

import datetime
import json
import os
import re
import smtplib
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

ROOT = os.path.dirname(__file__)
SITE = "https://www.dandaakhilreddy.com"
EP = os.environ.get("AZURE_OPENAI_ENDPOINT", "").rstrip("/")
KEY = os.environ.get("AZURE_OPENAI_KEY", "")
DEP = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1")
SMTP_USER = os.environ["SMTP_USER"]
SMTP_PASS = os.environ["SMTP_PASS"]
NOTIFY = os.environ["NOTIFY_EMAIL"]

LANE_COLORS = {
    "AI & Developers": "#7c3aed", "Compute": "#0891b2", "Microsoft": "#0078d4",
    "Project DANDA": "#f5c518", "Semiconductors": "#0891b2", "Anthropic": "#7c3aed",
    "LLM Research": "#7c3aed", "Markets": "#16a34a",
}


def fancy_date(iso: str) -> str:
    d = datetime.date.fromisoformat(iso)
    n = d.day
    suf = "th" if 11 <= n % 100 <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suf} {d.strftime('%B')}, {d.year}"


def todays_posts() -> tuple[str, list[dict]]:
    posts = json.load(open(os.path.join(ROOT, "posts.json"), encoding="utf-8"))
    if not posts:
        return "", []
    latest = max(p["date"] for p in posts)
    day = [p for p in posts if p["date"] == latest]
    # news lanes first, DANDA last
    day.sort(key=lambda p: (1 if "DANDA" in p.get("category", "") else 0))
    return latest, day


def takeaways(post: dict) -> list[str]:
    """3 crisp bullets a busy engineer should remember. Empty list if Foundry is off."""
    if not (EP and KEY):
        return []
    try:
        url = f"{EP}/openai/deployments/{DEP}/chat/completions?api-version=2024-06-01"
        text = re.sub(r"<[^>]+>", " ", post.get("body", ""))[:6000]
        body = {"messages": [
            {"role": "system", "content":
             "You write study notes for a senior engineer. Return ONLY a JSON array of exactly 3 short "
             "strings: the 3 things worth remembering from the article — concrete, specific, no fluff."},
            {"role": "user", "content": f"Title: {post['title']}\n\n{text}"}],
            "max_tokens": 300, "temperature": 0.3}
        req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json", "api-key": KEY})
        out = json.loads(urllib.request.urlopen(req, timeout=60).read())["choices"][0]["message"]["content"]
        m = re.search(r"\[.*\]", out, re.S)
        arr = json.loads(m.group(0)) if m else []
        return [str(x) for x in arr][:3]
    except Exception:
        return []


def strip_svg(html: str) -> str:
    """Gmail drops inline SVG — replace DANDA's architecture diagram with a link note."""
    return re.sub(r"<svg.*?</svg>", "<p><em>[Architecture diagram — view it on the blog]</em></p>",
                  html, flags=re.S)


def render_post(p: dict) -> tuple[str, str]:
    link = f"{SITE}/blog/posts/{p['slug']}.html"
    cat = p.get("category", "")
    color = LANE_COLORS.get(cat, "#e50914")
    tk = takeaways(p)
    tk_html = ("<div style='background:#fff8e6;border-left:4px solid #f5c518;padding:12px 16px;margin:14px 0;border-radius:8px'>"
               "<div style='font-weight:800;font-size:.8em;letter-spacing:.08em;color:#8a6d00'>⚡ KEY TAKEAWAYS</div><ul style='margin:8px 0 0;padding-left:20px'>"
               + "".join(f"<li style='margin:4px 0'>{t}</li>" for t in tk) + "</ul></div>") if tk else ""
    body = strip_svg(p.get("body", ""))
    srcs = p.get("sources") or []
    src_html = ("<p style='font-size:.85em;color:#666;margin-top:14px'><b>Sources:</b> "
                + " · ".join(f"<a href='{s.get('url','#')}' style='color:#0078d4'>{s.get('title','source')}</a>"
                             for s in srcs if isinstance(s, dict)) + "</p>") if srcs else ""
    html = f"""
<div style="border:1px solid #e8e8e8;border-radius:14px;overflow:hidden;margin:0 0 26px;background:#fff">
  <img src="{p.get('image','')}" style="width:100%;height:170px;object-fit:cover;display:block" alt="">
  <div style="padding:20px 22px">
    <span style="background:{color};color:#fff;font-weight:800;font-size:.72em;letter-spacing:.1em;padding:4px 10px;border-radius:999px">{cat.upper()}</span>
    <h2 style="margin:10px 0 6px;font-size:1.35em;line-height:1.25"><a href="{link}" style="color:#111;text-decoration:none">{p['title']}</a></h2>
    <p style="color:#555;margin:0 0 6px;font-size:.98em">{p.get('summary','')}</p>
    {tk_html}
    <div style="font-size:.97em;line-height:1.6;color:#222">{body}</div>
    {src_html}
    <p style="margin-top:14px"><a href="{link}" style="color:#0078d4;font-weight:700;text-decoration:none">Read on the blog →</a></p>
  </div>
</div>"""
    plain = (f"\n{'='*60}\n[{cat}] {p['title']}\n{p.get('summary','')}\n"
             + ("".join(f"  • {t}\n" for t in tk) if tk else "")
             + f"{link}\n")
    return html, plain


def send() -> None:
    day, posts = todays_posts()
    if not posts:
        print("no posts to digest")
        return
    news = [p for p in posts if "DANDA" not in p.get("category", "")]
    danda = [p for p in posts if "DANDA" in p.get("category", "")]
    parts = [render_post(p) for p in posts]
    html_posts = "".join(h for h, _ in parts)
    plain_posts = "".join(t for _, t in parts)
    fd = fancy_date(day)
    subj = f"☕ Reddy Pulse Digest — {fd}: {len(news)} news" + (f" + {danda[0]['title'].split('—')[0].strip()}" if danda else "")
    html = f"""<div style="font-family:Segoe UI,Arial,sans-serif;max-width:680px;margin:auto;background:#f4f5f8;padding:18px">
<div style="text-align:center;padding:10px 0 18px">
  <div style="font-size:1.9em;font-weight:900;letter-spacing:-.02em">Reddy <span style="color:#e50914">Pulse</span> Digest</div>
  <div style="color:#666;margin-top:4px">{fd} · {len(news)} news posts{' · 1 DANDA blueprint' if danda else ''} · ~10 min read</div>
</div>
{html_posts}
<div style="text-align:center;color:#888;font-size:.85em;padding:10px 0 4px">
  <a href="{SITE}/blog/" style="color:#0078d4">All posts</a> · <a href="{SITE}/blog/feed.xml" style="color:#0078d4">RSS</a> · sent automatically by your Reddy Pulse pipeline
</div></div>"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subj
    msg["From"] = f"Reddy Pulse Digest <{SMTP_USER}>"
    msg["To"] = NOTIFY
    msg.attach(MIMEText(f"Reddy Pulse Digest — {fd}\n{plain_posts}\n{SITE}/blog/", "plain"))
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)
    print(f"digest sent: {day} · {len(posts)} posts")


if __name__ == "__main__":
    send()
