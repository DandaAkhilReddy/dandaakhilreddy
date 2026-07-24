#!/usr/bin/env python3
"""Reddy Pulse blog generator.

Reads blog/posts.json -> renders blog/index.html + blog/posts/<slug>.html.
The daily automation appends new posts to posts.json and re-runs this.
"""

from __future__ import annotations

import html
import json
import pathlib

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
  <div class="cat">{category}</div>
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
      <span class="cat">{category}</span>
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
            category=html.escape(p["category"]), date=p["date"],
            read_min=max(2, round(words / 200)), image=p["image"],
            body=p["body"], source_lis=source_lis)
        (ROOT / "posts" / f'{p["slug"]}.html').write_text(page, encoding="utf-8")
    cards = "\n".join(CARD_TMPL.format(
        slug=p["slug"], image=p["image"], category=html.escape(p["category"]),
        title=html.escape(p["title"]), summary=html.escape(p["summary"]),
        date=p["date"], read_min=max(2, round(len(p["body"].split()) / 200)))
        for p in posts)
    (ROOT / "index.html").write_text(INDEX_TMPL.format(cards=cards), encoding="utf-8")
    print(f"rendered {len(posts)} posts")


if __name__ == "__main__":
    render()
