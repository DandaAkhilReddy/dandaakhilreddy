#!/usr/bin/env python3
"""Email Akhil a ready-to-post LinkedIn caption + image + link for the newest post.

Runs at the end of each cloud content workflow. Uses Azure Foundry to write the
caption in Akhil's voice; falls back to a template if the model is unavailable.
"""

from __future__ import annotations

import json
import os
import smtplib
import sys
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


def newest(mode: str) -> dict | None:
    posts = json.load(open(os.path.join(ROOT, "posts.json"), encoding="utf-8"))
    if mode == "danda":
        posts = [p for p in posts if "DANDA" in p.get("category", "")]
    posts.sort(key=lambda p: p["date"])
    return posts[-1] if posts else None


def caption(post: dict) -> str:
    link = f"{SITE}/blog/posts/{post['slug']}.html"
    if EP and KEY:
        try:
            url = f"{EP}/openai/deployments/{DEP}/chat/completions?api-version=2024-06-01"
            sys_p = ("You are Akhil Reddy Danda, a Microsoft engineer. Write a punchy LinkedIn post "
                     "(120-170 words) in first person about the article below. Hook in line one, 2-3 "
                     "short insight lines, end with a call to read + the link, then 4 relevant hashtags. "
                     "No emojis-spam; one or two max. Sound human, not like an ad.")
            usr = f"Title: {post['title']}\nSummary: {post['summary']}\nLink: {link}"
            body = {"messages": [{"role": "system", "content": sys_p},
                                {"role": "user", "content": usr}],
                    "max_tokens": 400, "temperature": 0.8}
            req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                         headers={"Content-Type": "application/json", "api-key": KEY})
            return json.loads(urllib.request.urlopen(req, timeout=60).read())["choices"][0]["message"]["content"].strip()
        except Exception:
            pass
    return (f"{post['title']}\n\n{post['summary']}\n\nFull piece on my blog:\n{link}\n\n"
            "#Tech #AI #SoftwareEngineering #Microsoft")


def send(mode: str) -> None:
    post = newest(mode)
    if not post:
        print("no post to notify")
        return
    link = f"{SITE}/blog/posts/{post['slug']}.html"
    cap = caption(post)
    label = "Project DANDA" if mode == "danda" else "Reddy Pulse"
    html_body = f"""<div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e5e5;border-radius:14px;overflow:hidden">
<img src="{post['image']}" style="width:100%;height:230px;object-fit:cover" alt="">
<div style="padding:22px">
<div style="color:#e50914;font-weight:800;font-size:.75em;letter-spacing:.1em">{label.upper()} · TODAY'S POST</div>
<h2 style="margin:6px 0 4px">{post['title']}</h2>
<p style="color:#555;margin:0 0 16px">{post['summary']}</p>
<a href="{link}" style="background:#e50914;color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-weight:700;display:inline-block">Read on my blog →</a>
<p style="color:#777;font-size:.85em;margin:22px 0 6px"><b>📋 Copy-paste this to LinkedIn:</b></p>
<pre style="background:#f6f6f6;padding:16px;border-radius:10px;white-space:pre-wrap;font-family:inherit;font-size:.95em;line-height:1.5">{cap}</pre>
<p style="color:#999;font-size:.8em;margin-top:16px">🖼️ Image to attach: <a href="{post['image']}">download here</a> (right-click → Save image)</p>
</div></div>"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"📝 {label}: today's post is live — LinkedIn caption inside"
    msg["From"] = f"{label} <{SMTP_USER}>"
    msg["To"] = NOTIFY
    msg.attach(MIMEText(cap + f"\n\nImage: {post['image']}\nBlog: {link}", "plain"))
    msg.attach(MIMEText(html_body, "html"))
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=25) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)
    print("LinkedIn email sent for:", post["slug"])


if __name__ == "__main__":
    send(sys.argv[1] if len(sys.argv) > 1 else "pulse")
