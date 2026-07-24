#!/usr/bin/env python3
"""Reddy Pulse blog generator.

Reads blog/posts.json -> renders blog/index.html + blog/posts/<slug>.html.
The daily automation appends new posts to posts.json and re-runs this.
"""

from __future__ import annotations

import html
import json
import pathlib


def fancy_date(iso: str) -> str:
    """2026-07-23 -> '23rd July, 2026'."""
    import datetime
    try:
        d = datetime.date.fromisoformat(iso)
    except Exception:
        return iso
    day = d.day
    suf = "th" if 11 <= day % 100 <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return f"{day}{suf} {d.strftime('%B')}, {d.year}"


ROOT = pathlib.Path(__file__).parent

POST_TMPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Reddy Pulse</title>
<meta name="description" content="{summary}">
<link rel="stylesheet" href="../blog.css">
</head>
<body>
<nav class="pnav"><a href="../../browse.html">← Portfolio</a><a href="../index.html">Reddy Pulse</a></nav>
<article>
  <div class="cat{danda}">{category}</div>
  <h1>{title}</h1>
  <div class="byline">By Akhil Reddy Danda · {date} · {read_min} min read</div>
  <img class="hero" src="{image}" alt="{title}">
  {body}
  <div class="sources"><strong>Sources I read for this:</strong><ul>{source_lis}</ul></div>
</article>
<footer>© Akhil Reddy Danda · <a href="../index.html">More from Reddy Pulse</a></footer>
</body></html>"""

CARD_TMPL = """  <a class="bcard" href="posts/{slug}.html">
    <img src="{image}" alt="" loading="lazy">
    <div class="bcard-body">
      <span class="cat{danda}">{category}</span>
      <h2>{title}</h2>
      <p>{summary}</p>
      <div class="byline">{date} · {read_min} min read</div>
    </div>
  </a>"""

INDEX_TMPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reddy Pulse — Akhil's Daily Tech Blog</title>
<meta name="description" content="Daily takes on Microsoft, semiconductors, LLM research, and the tech market — written every morning.">
<link rel="stylesheet" href="blog.css">
</head>
<body>
<nav class="pnav"><a href="../browse.html">← Portfolio</a><span>Reddy Pulse</span></nav>
<header class="bhead">
  <h1>⚡ Reddy Pulse</h1>
  <p>My daily read on what actually matters in tech — Microsoft, silicon, LLM research, and the market. New posts every morning.</p>
  <div class="follow">
    <a class="follow-btn" href="feed.xml">📡 Follow via RSS</a>
    <a class="follow-btn ghost" href="https://www.linkedin.com/in/akhil-reddy-danda-1a74b214b/" target="_blank">in Follow on LinkedIn</a>
  </div>
</header>
<main class="bgrid">
{cards}
</main>
<footer>© Akhil Reddy Danda · <a href="../browse.html">dandaakhilreddy.com</a></footer>
</body></html>"""


def render() -> None:
    posts = json.loads((ROOT / "posts.json").read_text(encoding="utf-8"))
    posts.sort(key=lambda p: p["date"], reverse=True)
    (ROOT / "posts").mkdir(exist_ok=True)
    for p in posts:
        source_lis = "".join(
            f'<li><a href="{s["url"]}" target="_blank" rel="noopener">{html.escape(s["title"])}</a></li>'
            for s in p.get("sources", []))
        words = len(p["body"].split())
        page = POST_TMPL.format(
            title=html.escape(p["title"]), summary=html.escape(p["summary"]),
            category=html.escape(p["category"]), danda=" cat-danda" if "DANDA" in p["category"] else "", date=fancy_date(p["date"]),
            read_min=max(2, round(words / 200)), image=p["image"],
            body=p["body"], source_lis=source_lis)
        (ROOT / "posts" / f'{p["slug"]}.html').write_text(page, encoding="utf-8")
    cards = "\n".join(CARD_TMPL.format(
        slug=p["slug"], image=p["image"], category=html.escape(p["category"]),
        title=html.escape(p["title"]), summary=html.escape(p["summary"]),
        danda=" cat-danda" if "DANDA" in p["category"] else "", date=fancy_date(p["date"]), read_min=max(2, round(len(p["body"].split()) / 200)))
        for p in posts)
    (ROOT / "index.html").write_text(INDEX_TMPL.format(cards=cards), encoding="utf-8")

    # RSS feed — follow it like any blog (Microsoft-style)
    import datetime, email.utils
    items = []
    for p in posts[:40]:
        try:
            dt = datetime.datetime.fromisoformat(p["date"])
        except Exception:
            dt = datetime.datetime.utcnow()
        pub = email.utils.format_datetime(dt.replace(tzinfo=datetime.timezone.utc))
        link = f"https://www.dandaakhilreddy.com/blog/posts/{p['slug']}.html"
        desc = html.escape(p["summary"])
        items.append(
            f"<item><title>{html.escape(p['title'])}</title>"
            f"<link>{link}</link><guid>{link}</guid>"
            f"<pubDate>{pub}</pubDate>"
            f"<category>{html.escape(p['category'])}</category>"
            f"<description>{desc}</description></item>")
    rss = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0"><channel>'
        '<title>Reddy Pulse — Akhil Reddy Danda</title>'
        '<link>https://www.dandaakhilreddy.com/blog/index.html</link>'
        '<description>Daily tech takes and AI startup blueprints by Akhil Reddy Danda.</description>'
        '<language>en-us</language>' + "".join(items) + '</channel></rss>')
    (ROOT / "feed.xml").write_text(rss, encoding="utf-8")
    print(f"rendered {len(posts)} posts + RSS feed")


if __name__ == "__main__":
    render()
