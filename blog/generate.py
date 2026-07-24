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
<meta property="og:title" content="{title}">
<meta property="og:description" content="{summary}">
<meta property="og:image" content="{image}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../blog.css">
</head>
<body>
<nav class="pnav"><span class="brandmark">⚡ Reddy<b>Pulse</b></span><a href="../../browse.html">Portfolio</a><a href="../index.html">All Posts</a><a href="../feed.xml">RSS</a></nav>
<article>
  <span class="cat{danda}">{category}</span>
  <h1>{title}</h1>
  <div class="byline"><span class="avatar">AR</span> Akhil Reddy Danda · {date} · {read_min} min read</div>
  <img class="hero" src="{image}" alt="{title}">
  {body}
  <div class="sharebar">
    <a href="https://www.linkedin.com/sharing/share-offsite/?url={url}" target="_blank">in Share on LinkedIn</a>
    <a href="https://twitter.com/intent/tweet?url={url}&text={title_enc}" target="_blank">𝕏 Post</a>
  </div>
  <div class="sources"><strong>Sources I read for this:</strong><ul>{source_lis}</ul></div>
  <a class="backlink" href="../index.html">← More from Reddy Pulse</a>
</article>
<footer>© Akhil Reddy Danda · <a href="../index.html">Reddy Pulse</a> · <a href="../feed.xml">Follow via RSS</a></footer>
</body></html>"""

FEATURED_TMPL = """<section class="featured"><a href="posts/{slug}.html">
  <div class="img" style="background-image:url('{image}')"></div>
  <div class="body"><span class="cat{danda}">{category}</span><h2>{title}</h2><p>{summary}</p>
  <div class="meta">{date} · Akhil Reddy Danda</div></div>
</a></section>"""


CARD_TMPL = """  <a class="bcard" href="posts/{slug}.html" data-cat="{category}">
    <div class="thumb" style="background-image:url('{image}')"><span class="cat{danda}">{category}</span></div>
    <div class="bcard-body">
      <h2>{title}</h2>
      <p>{summary}</p>
      <div class="meta">{date}<span class="dot"></span>{read_min} min read</div>
    </div>
  </a>"""

INDEX_TMPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reddy Pulse — Akhil's Daily Tech Blog</title>
<meta name="description" content="Daily takes on Microsoft, semiconductors, LLM research, and AI startup blueprints — written every morning by Akhil Reddy Danda.">
<meta property="og:title" content="Reddy Pulse — Daily Tech & Startup Ideas">
<meta property="og:description" content="Microsoft, silicon, LLM research, and one AI startup blueprint a day.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<link rel="alternate" type="application/rss+xml" title="Reddy Pulse" href="feed.xml">
<link rel="stylesheet" href="blog.css">
</head>
<body>
<nav class="pnav"><span class="brandmark">⚡ Reddy<b>Pulse</b></span><a href="../browse.html">Portfolio</a><a href="../about.html">About</a><a href="feed.xml">RSS</a></nav>
<header class="bhead">
  <div class="kicker">Written every morning</div>
  <h1>⚡ Reddy <span class="spark">Pulse</span></h1>
  <p>My daily read on what actually matters in tech — Microsoft, silicon, LLM research, the market — plus one AI startup blueprint a day.</p>
  <div class="follow">
    <a class="follow-btn" href="feed.xml">📡 Follow via RSS</a>
    <a class="follow-btn ghost" href="https://www.linkedin.com/in/akhil-reddy-danda-1a74b214b/" target="_blank">in Follow on LinkedIn</a>
  </div>
</header>
{featured}
<div class="chips" id="chips"></div>
<main class="bgrid" id="grid">
{cards}
</main>
<footer>© Akhil Reddy Danda · <a href="../browse.html">dandaakhilreddy.com</a> · <a href="feed.xml">RSS</a></footer>
<script>
  const chips=document.getElementById('chips'),grid=document.getElementById('grid');
  const cats=[...new Set([...grid.children].map(c=>c.dataset.cat))];
  const mk=(t)=>{{const b=document.createElement('div');b.className='chip'+(t==='All'?' on':'');b.textContent=t;
    b.onclick=()=>{{document.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));b.classList.add('on');
    [...grid.children].forEach(c=>c.style.display=(t==='All'||c.dataset.cat===t)?'':'none');}};chips.appendChild(b);}};
  mk('All');cats.forEach(mk);
</script>
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
        import urllib.parse as _up
        url = _up.quote(f"https://www.dandaakhilreddy.com/blog/posts/{p['slug']}.html", safe="")
        page = POST_TMPL.format(
            title=html.escape(p["title"]), summary=html.escape(p["summary"]),
            category=html.escape(p["category"]), danda=" cat-danda" if "DANDA" in p["category"] else "", date=fancy_date(p["date"]),
            read_min=max(2, round(words / 200)), image=p["image"],
            body=p["body"], source_lis=source_lis, url=url,
            title_enc=_up.quote(p["title"]))
        (ROOT / "posts" / f'{p["slug"]}.html').write_text(page, encoding="utf-8")
    feat = posts[0] if posts else None
    rest = posts[1:] if posts else []
    featured_html = ""
    if feat:
        featured_html = FEATURED_TMPL.format(
            slug=feat["slug"], image=feat["image"], category=html.escape(feat["category"]),
            danda=" cat-danda" if "DANDA" in feat["category"] else "",
            title=html.escape(feat["title"]), summary=html.escape(feat["summary"]),
            date=fancy_date(feat["date"]))
    cards = "\n".join(CARD_TMPL.format(
        slug=p["slug"], image=p["image"], category=html.escape(p["category"]),
        title=html.escape(p["title"]), summary=html.escape(p["summary"]),
        danda=" cat-danda" if "DANDA" in p["category"] else "", date=fancy_date(p["date"]),
        read_min=max(2, round(len(p["body"].split()) / 200)))
        for p in rest)
    (ROOT / "index.html").write_text(INDEX_TMPL.format(cards=cards, featured=featured_html), encoding="utf-8")

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
