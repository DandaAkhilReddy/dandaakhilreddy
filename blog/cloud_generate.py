#!/usr/bin/env python3
"""Cloud content generator — runs on GitHub Actions using Azure Foundry.

Modes:
  pulse  -> 3 daily posts: AI & Developers · Compute · Microsoft
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


def clean_slug(slug: str) -> str:
    """Filesystem/URL-safe slugs — letters, digits, hyphens only."""
    s = re.sub(r"[^a-zA-Z0-9-]+", "-", slug or "").strip("-")
    return re.sub(r"-{2,}", "-", s)


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
        f"Today is {TODAY}. Write 3 short blog posts (350-450 words each), one per lane, in this order:\n"
        "(1) category \"AI & Developers\" — the most important AI news of the moment PLUS how developers "
        "are actually using AI day to day: agentic coding with Claude / Claude Code, loop engineering "
        "(plan→act→verify→fix loops), spec-driven prompting, MCP tool servers, eval-driven development, "
        "AI pair-programming workflows. Concrete, from a practitioner's seat.\n"
        "(2) category \"Compute\" — compute news: GPUs/TPUs/custom silicon, datacenter build-outs, "
        "inference costs, energy, chips supply chain, what it means for engineers shipping AI.\n"
        "(3) category \"Microsoft\" — Microsoft updates, framed as: what Microsoft (Azure, Copilot, "
        "Foundry, GitHub, Windows) should learn or adopt from the latest OpenAI, Anthropic, Google or "
        "other frontier-lab releases — specific, constructive, engineer-to-engineer, no fanboying.\n"
        "Base them on your knowledge of the current tech landscape; be specific and technical. "
        f"Do NOT repeat these recent titles: {recent}. Return a JSON array of exactly 3 items; each has: "
        f"slug (\"{TODAY}-topic-words\", lowercase words and hyphens ONLY), date (\"{TODAY}\"), "
        "category (exactly one of: AI & Developers | Compute | Microsoft), title, summary (1-2 sentences), "
        "image (a topical Unsplash URL like https://images.unsplash.com/photo-<id>?w=1200&h=600&fit=crop; "
        "vary the photo ids), body (HTML with <p>, <h2>, <strong>), sources (2-3 {title,url} of reputable outlets)."
    )
    items = extract_json(chat(PULSE_SYS, prompt))
    for it in items:
        it["slug"] = clean_slug(it.get("slug", ""))
    existing = {p["slug"] for p in posts}
    added = [it for it in items if it.get("slug") and it["slug"] not in existing][:3]
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
    obj["slug"] = clean_slug(obj.get("slug", ""))
    if obj.get("slug") and obj["slug"] not in {p["slug"] for p in posts}:
        save(posts + [obj])
        return [obj]
    return []


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "pulse"
    added = run_pulse() if mode == "pulse" else run_danda()
    print(json.dumps({"mode": mode, "added": [p["slug"] for p in added]}))
