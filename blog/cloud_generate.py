#!/usr/bin/env python3
"""Cloud content generator — runs on GitHub Actions using Azure Foundry.

Modes:
  pulse  -> 3 daily tech-news blog posts (Microsoft-first)
  danda  -> 1 daily startup blueprint with an SVG architecture diagram

Machine-independent: no laptop required. Appends to blog/posts.json,
re-renders via generate.py, and the workflow commits + deploys.
"""

from __future__ import annotations

import datetime
import json
import os
import re
import sys
import urllib.request

EP = os.environ["AZURE_OPENAI_ENDPOINT"].rstrip("/")
KEY = os.environ["AZURE_OPENAI_KEY"]
DEP = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1")
TODAY = datetime.date.today().isoformat()
POSTS = os.path.join(os.path.dirname(__file__), "posts.json")


def chat(system: str, user: str, max_tokens: int = 2600) -> str:
    url = f"{EP}/openai/deployments/{DEP}/chat/completions?api-version=2024-06-01"
    body = {"messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}],
            "max_tokens": max_tokens, "temperature": 0.8}
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", "api-key": KEY})
    out = json.loads(urllib.request.urlopen(req, timeout=120).read())
    return out["choices"][0]["message"]["content"]


def extract_json(txt: str):
    m = re.search(r"\[.*\]|\{.*\}", txt, re.S)
    if not m:
        raise ValueError("no JSON in model output")
    return json.loads(m.group(0))


def load_posts() -> list[dict]:
    with open(POSTS, encoding="utf-8") as f:
        return json.load(f)


def save(posts: list[dict]) -> None:
    with open(POSTS, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=1, ensure_ascii=False)


PULSE_SYS = (
    "You are Akhil Reddy Danda, a Software Engineer II at Microsoft who ships side projects daily "
    "and writes a personal tech blog called Reddy Pulse. Write in first person: curious, direct, "
    "opinionated but grounded, short paragraphs, always explaining WHY things matter for engineers. "
    "Never sound like AI marketing copy. Output ONLY a JSON array."
)


def run_pulse() -> list[dict]:
    posts = load_posts()
    recent = [p["title"] for p in posts[-15:]]
    prompt = (
        f"Today is {TODAY}. Write 3 short blog posts (350-450 words each) on the most important "
        "recent developments in: (1) Microsoft — ALWAYS include one Microsoft post; (2) semiconductors "
        "or AI hardware; (3) LLM research or a frontier AI lab. Base them on your knowledge of the "
        "current tech landscape; be specific and technical. Do NOT repeat these recent titles: "
        f"{recent}. Return a JSON array; each item has: slug (\"{TODAY}-topic-words\"), date "
        f"(\"{TODAY}\"), category (Microsoft|Semiconductors|LLM Research|Anthropic|Markets), title, "
        "summary (1-2 sentences), image (a topical Unsplash URL like "
        "https://images.unsplash.com/photo-<id>?w=1200&h=600&fit=crop), body (HTML with <p>, <h2>, "
        "<strong>), sources (2-3 {title,url} of reputable outlets). Vary the Unsplash photo ids."
    )
    items = extract_json(chat(PULSE_SYS, prompt))
    existing = {p["slug"] for p in posts}
    added = [it for it in items if it.get("slug") and it["slug"] not in existing]
    save(posts + added)
    return added


DANDA_SYS = (
    "You are Akhil Reddy Danda, a Microsoft engineer and sharp startup founder. Project DANDA is your "
    "daily blueprint series: find ONE real societal problem and design one buildable AI-software company. "
    "First person, confident, no fluff. Present the problem as known reality with real numbers — never "
    "mention research or reading articles. Output ONLY a JSON object."
)


def run_danda() -> list[dict]:
    posts = load_posts()
    prior = [p["title"] for p in posts if "DANDA" in p.get("category", "")]
    n = len(prior) + 1
    prompt = (
        f"Today is {TODAY}. Produce Project DANDA #{n:03d}: one startup blueprint for an AI agent / "
        "agentic automation solving a real problem in a domain you have NOT used before in these prior "
        f"ideas: {prior}. Return a JSON object with: slug (\"{TODAY}-danda-{n:03d}-name\"), date "
        f"(\"{TODAY}\"), category \"Project DANDA\", title (\"DANDA #{n:03d} — <Name>: <sharp hook>\"), "
        "summary, image (topical Unsplash URL ?w=1200&h=600&fit=crop), body (HTML), sources (2-3 "
        "{title,url} of real stat sources). The body MUST contain, in order: <p> intro; <h2>The problem</h2> "
        "with real statistics; <h2>The idea: <Name></h2>; <h2>Architecture</h2> followed by an INLINE <svg "
        "viewBox='0 0 760 440'> dark (#111) architecture diagram with labeled boxes, arrows (define a marker), "
        "and gold #f5c518 accents showing layers Inputs→Ingestion→Memory/Graph→Agent Orchestrator→Human "
        "Gate→Action Layer, specific to THIS idea; then a paragraph explaining the flow; "
        "<h2>Build plan (90 days)</h2> wedge+stack+pricing; <h2>Why now</h2>. 600-850 words plus the SVG."
    )
    obj = extract_json(chat(DANDA_SYS, prompt, max_tokens=3200))
    if obj.get("slug") and obj["slug"] not in {p["slug"] for p in posts}:
        save(posts + [obj])
        return [obj]
    return []


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "pulse"
    added = run_pulse() if mode == "pulse" else run_danda()
    print(json.dumps({"mode": mode, "added": [p["slug"] for p in added]}))
