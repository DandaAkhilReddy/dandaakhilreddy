/**
 * Comprehensive tests for all 12 project detail pages.
 * Pattern: static JSDOM, no script execution.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

// ── Helpers ──────────────────────────────────────────────────────────────────

const PROJECTS_DIR = resolve(__dirname, "../projects");

function loadDoc(filename) {
  const html = readFileSync(resolve(PROJECTS_DIR, filename), "utf-8");
  return new JSDOM(html).window.document;
}

function loadRaw(filename) {
  return readFileSync(resolve(PROJECTS_DIR, filename), "utf-8");
}

// All 12 project files
const ALL_PAGES = [
  "day-1-llm-ios.html",
  "day-2-claude-peepee.html",
  "day-3-speakskiptype.html",
  "day-4-audtext.html",
  "day-minus-5-wifivision.html",
  "day-6-localbrowsercontrol.html",
  "day-7-reddyhedgefund.html",
  "day-8-stock-analyzer.html",
  "adas-system.html",
  "financial-sentiment.html",
  "healthcare-rag.html",
  "claude-peepee.html",
];

// ── Common template tests (run for every page) ───────────────────────────────

describe.each(ALL_PAGES)("Common template — %s", (filename) => {
  let doc;
  let raw;

  beforeEach(() => {
    doc = loadDoc(filename);
    raw = loadRaw(filename);
  });

  it("has DOCTYPE html declaration", () => {
    expect(raw.toLowerCase()).toMatch(/^<!doctype html>/);
  });

  it("html element has lang=\"en\"", () => {
    const html = doc.documentElement;
    expect(html.getAttribute("lang")).toBe("en");
  });

  it("has meta charset UTF-8", () => {
    const charset = doc.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
    expect(charset.getAttribute("charset").toUpperCase()).toBe("UTF-8");
  });

  it("has viewport meta tag", () => {
    const viewport = doc.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute("content")).toMatch(/width=device-width/);
  });

  it("title is non-empty", () => {
    expect(doc.title.trim().length).toBeGreaterThan(0);
  });

  it("links netflix-styles.css", () => {
    const links = [...doc.querySelectorAll('link[rel="stylesheet"]')];
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h && h.includes("netflix-styles.css"))).toBe(true);
  });

  it("links project-styles.css", () => {
    const links = [...doc.querySelectorAll('link[rel="stylesheet"]')];
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h && h.includes("project-styles.css"))).toBe(true);
  });

  it("has Google Fonts link", () => {
    const links = [...doc.querySelectorAll("link")];
    const hrefs = links.map((l) => l.getAttribute("href") || "");
    expect(hrefs.some((h) => h.includes("fonts.googleapis"))).toBe(true);
  });

  it(".navbar exists", () => {
    expect(doc.querySelector(".navbar")).not.toBeNull();
  });

  it("navbar has logo link to ../browse.html", () => {
    const logo = doc.querySelector(".navbar .nav-logo");
    expect(logo).not.toBeNull();
    expect(logo.getAttribute("href")).toBe("../browse.html");
  });

  it("has .project-hero section", () => {
    expect(doc.querySelector(".project-hero")).not.toBeNull();
  });

  it(".project-hero has h1 with non-empty text", () => {
    const hero = doc.querySelector(".project-hero");
    expect(hero).not.toBeNull();
    const h1 = hero.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent.trim().length).toBeGreaterThan(0);
  });

  it("has .back-link element", () => {
    expect(doc.querySelector(".back-link")).not.toBeNull();
  });

  it("has at least 1 CTA button (.btn-primary or .btn-outline)", () => {
    const ctaButtons = doc.querySelectorAll(".btn-primary, .btn-outline");
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("footer element exists", () => {
    expect(doc.querySelector("footer")).not.toBeNull();
  });
});

// ── Per-page specific tests ───────────────────────────────────────────────────

describe("day-1-llm-ios.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-1-llm-ios.html"); });

  it("title contains 'LLM' or 'iOS'", () => {
    expect(doc.title).toMatch(/LLM|iOS/i);
  });

  it("has .project-badge-large with text containing 'Day 1'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Day 1/i);
  });

  it(".project-tech-section has .tech-item elements", () => {
    const techSection = doc.querySelector(".project-tech-section");
    expect(techSection).not.toBeNull();
    const items = techSection.querySelectorAll(".tech-item");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});

describe("day-2-claude-peepee.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-2-claude-peepee.html"); });

  it("title contains 'Claude'", () => {
    expect(doc.title).toMatch(/Claude/i);
  });

  it("has badge text containing 'Day 2'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Day 2/i);
  });
});

describe("day-3-speakskiptype.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-3-speakskiptype.html"); });

  it("title contains 'SpeakSkipType'", () => {
    expect(doc.title).toMatch(/SpeakSkipType/i);
  });

  it("has badge text containing 'Day 3'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Day 3/i);
  });
});

describe("day-4-audtext.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-4-audtext.html"); });

  it("title contains 'Audtext'", () => {
    expect(doc.title).toMatch(/Audtext/i);
  });

  it("has badge text containing 'Day 4'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Day 4/i);
  });
});

describe("day-minus-5-wifivision.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-minus-5-wifivision.html"); });

  it("title contains 'WiFiVision'", () => {
    expect(doc.title).toMatch(/WiFiVision/i);
  });

  it("has badge text containing 'Project 5' or 'Day 5' or 'Day -5'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Project 5|Day[\s-]*5/i);
  });
});

describe("day-6-localbrowsercontrol.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-6-localbrowsercontrol.html"); });

  it("title contains 'Browser' or 'Control'", () => {
    expect(doc.title).toMatch(/Browser|Control/i);
  });

  it("has badge text containing 'Project 6' or 'Day 6'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Project 6|Day 6/i);
  });
});

describe("day-7-reddyhedgefund.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-7-reddyhedgefund.html"); });

  it("title contains 'Hedge Fund' or 'Reddy'", () => {
    expect(doc.title).toMatch(/Hedge Fund|Reddy/i);
  });

  it("has badge text containing 'Project 7' or 'Day 7'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Project 7|Day 7/i);
  });
});

describe("day-8-stock-analyzer.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-8-stock-analyzer.html"); });

  it("title contains 'Stock' or 'Analyzer'", () => {
    expect(doc.title).toMatch(/Stock|Analyzer/i);
  });

  it("has badge text containing 'Project 8' or 'Day 8'", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toMatch(/Project 8|Day 8/i);
  });
});

describe("adas-system.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("adas-system.html"); });

  it("title contains 'ADAS'", () => {
    expect(doc.title).toMatch(/ADAS/i);
  });

  it("badge mentions 'Amazon' or project type", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    // badge is "Amazon | ML Project"
    expect(badge.textContent).toMatch(/Amazon|ML Project|Project/i);
  });
});

describe("financial-sentiment.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("financial-sentiment.html"); });

  it("title contains 'Financial' or 'Sentiment'", () => {
    expect(doc.title).toMatch(/Financial|Sentiment/i);
  });

  it("has NLP-related content in the page body", () => {
    const body = doc.body.textContent;
    expect(body).toMatch(/NLP|BERT|transformer|sentiment/i);
  });

  it("badge text is non-empty", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim().length).toBeGreaterThan(0);
  });
});

describe("healthcare-rag.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("healthcare-rag.html"); });

  it("title contains 'Healthcare' or 'RAG'", () => {
    expect(doc.title).toMatch(/Healthcare|RAG/i);
  });

  it("badge text is non-empty", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim().length).toBeGreaterThan(0);
  });
});

describe("claude-peepee.html — per-page specifics", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("claude-peepee.html"); });

  it("title contains 'Claude'", () => {
    expect(doc.title).toMatch(/Claude/i);
  });

  it("badge text is non-empty", () => {
    const badge = doc.querySelector(".project-badge-large");
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim().length).toBeGreaterThan(0);
  });
});

// ── Section-depth tests (representative pages) ───────────────────────────────

describe("day-1-llm-ios.html — section depth", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-1-llm-ios.html"); });

  it(".project-content-section exists with problem/solution layout", () => {
    const section = doc.querySelector(".project-content-section");
    expect(section).not.toBeNull();
    const blocks = section.querySelectorAll(".content-block");
    expect(blocks.length).toBeGreaterThanOrEqual(2);
  });

  it(".project-features-section has at least 3 feature-card elements", () => {
    const section = doc.querySelector(".project-features-section");
    expect(section).not.toBeNull();
    const cards = section.querySelectorAll(".feature-card");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it(".project-tech-section has .tech-grid with at least 3 .tech-item elements", () => {
    const section = doc.querySelector(".project-tech-section");
    expect(section).not.toBeNull();
    const grid = section.querySelector(".tech-grid");
    expect(grid).not.toBeNull();
    const items = grid.querySelectorAll(".tech-item");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it(".project-cta-section exists with CTA buttons", () => {
    const cta = doc.querySelector(".project-cta-section");
    expect(cta).not.toBeNull();
    const buttons = cta.querySelectorAll(".btn-primary, .btn-outline");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});

describe("day-2-claude-peepee.html — section depth", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-2-claude-peepee.html"); });

  it(".project-content-section has problem and solution content-blocks", () => {
    const section = doc.querySelector(".project-content-section");
    expect(section).not.toBeNull();
    const blocks = section.querySelectorAll(".content-block");
    expect(blocks.length).toBeGreaterThanOrEqual(2);
  });

  it(".project-features-section has at least 3 feature-card elements", () => {
    const section = doc.querySelector(".project-features-section");
    expect(section).not.toBeNull();
    expect(section.querySelectorAll(".feature-card").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-tech-section .tech-grid has at least 3 tech-items", () => {
    const grid = doc.querySelector(".project-tech-section .tech-grid");
    expect(grid).not.toBeNull();
    expect(grid.querySelectorAll(".tech-item").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-cta-section has at least one CTA link", () => {
    const cta = doc.querySelector(".project-cta-section");
    expect(cta).not.toBeNull();
    const links = cta.querySelectorAll("a.btn-primary, a.btn-outline");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});

describe("day-8-stock-analyzer.html — section depth", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("day-8-stock-analyzer.html"); });

  it(".project-content-section has at least 2 content-block elements", () => {
    const section = doc.querySelector(".project-content-section");
    expect(section).not.toBeNull();
    expect(section.querySelectorAll(".content-block").length).toBeGreaterThanOrEqual(2);
  });

  it(".project-features-section has at least 3 feature-card elements", () => {
    const section = doc.querySelector(".project-features-section");
    expect(section).not.toBeNull();
    expect(section.querySelectorAll(".feature-card").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-tech-section has .tech-grid with at least 3 .tech-item elements", () => {
    const grid = doc.querySelector(".project-tech-section .tech-grid");
    expect(grid).not.toBeNull();
    expect(grid.querySelectorAll(".tech-item").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-cta-section exists", () => {
    expect(doc.querySelector(".project-cta-section")).not.toBeNull();
  });
});

describe("healthcare-rag.html — section depth", () => {
  let doc;
  beforeEach(() => { doc = loadDoc("healthcare-rag.html"); });

  it(".project-content-section has at least 2 content-block elements", () => {
    const section = doc.querySelector(".project-content-section");
    expect(section).not.toBeNull();
    expect(section.querySelectorAll(".content-block").length).toBeGreaterThanOrEqual(2);
  });

  it(".project-features-section has at least 3 feature-card elements", () => {
    const section = doc.querySelector(".project-features-section");
    expect(section).not.toBeNull();
    expect(section.querySelectorAll(".feature-card").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-tech-section .tech-grid has at least 3 .tech-item elements", () => {
    const grid = doc.querySelector(".project-tech-section .tech-grid");
    expect(grid).not.toBeNull();
    expect(grid.querySelectorAll(".tech-item").length).toBeGreaterThanOrEqual(3);
  });

  it(".project-cta-section has CTA buttons", () => {
    const cta = doc.querySelector(".project-cta-section");
    expect(cta).not.toBeNull();
    expect(cta.querySelectorAll(".btn-primary, .btn-outline").length).toBeGreaterThanOrEqual(1);
  });
});

// ── Script behavior tests ─────────────────────────────────────────────────────

describe.each(ALL_PAGES)("Script behavior — %s", (filename) => {
  let raw;
  beforeEach(() => { raw = loadRaw(filename); });

  it("contains navbar scroll effect logic using scrollY", () => {
    expect(raw).toMatch(/window\.scrollY/);
  });

  it("contains hamburger menu toggle logic", () => {
    expect(raw).toMatch(/hamburger/);
  });

  it("has IntersectionObserver for scroll animations", () => {
    expect(raw).toMatch(/IntersectionObserver/);
  });
});

// ── External link security tests ─────────────────────────────────────────────

describe.each(ALL_PAGES)("External links use https — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it("all external anchor hrefs use https:// not http://", () => {
    const anchors = [...doc.querySelectorAll("a[href]")];
    const externalLinks = anchors
      .map((a) => a.getAttribute("href"))
      .filter((href) => href.startsWith("http://"));
    expect(externalLinks).toHaveLength(0);
  });
});

// ── Navbar structural integrity (all pages) ───────────────────────────────────

describe.each(ALL_PAGES)("Navbar structure — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it("has .hamburger element inside navbar", () => {
    const hamburger = doc.querySelector(".navbar .hamburger");
    expect(hamburger).not.toBeNull();
  });

  it("has .nav-menu inside navbar", () => {
    const menu = doc.querySelector(".navbar .nav-menu");
    expect(menu).not.toBeNull();
  });

  it(".nav-menu has at least 3 list items", () => {
    const items = doc.querySelectorAll(".navbar .nav-menu li");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });
});

// ── Hero section structural integrity (all pages) ────────────────────────────

describe.each(ALL_PAGES)("Hero section structure — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".project-hero-content exists inside .project-hero", () => {
    const hero = doc.querySelector(".project-hero");
    expect(hero).not.toBeNull();
    expect(hero.querySelector(".project-hero-content")).not.toBeNull();
  });

  it(".project-badge-large exists inside .project-hero", () => {
    const hero = doc.querySelector(".project-hero");
    expect(hero.querySelector(".project-badge-large")).not.toBeNull();
  });

  it(".project-title h1 text is non-empty", () => {
    const title = doc.querySelector(".project-hero .project-title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).not.toBe("");
  });
});

// ── Tech section present on all pages ────────────────────────────────────────

describe.each(ALL_PAGES)("Tech section present — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".project-tech-section exists", () => {
    expect(doc.querySelector(".project-tech-section")).not.toBeNull();
  });

  it(".tech-grid exists inside .project-tech-section", () => {
    const section = doc.querySelector(".project-tech-section");
    expect(section.querySelector(".tech-grid")).not.toBeNull();
  });

  it("has at least 1 .tech-item", () => {
    expect(doc.querySelectorAll(".tech-item").length).toBeGreaterThanOrEqual(1);
  });
});

// ── CTA section present on all pages ─────────────────────────────────────────

describe.each(ALL_PAGES)("CTA section present — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".project-cta-section exists", () => {
    expect(doc.querySelector(".project-cta-section")).not.toBeNull();
  });

  it(".cta-buttons exists inside .project-cta-section", () => {
    const cta = doc.querySelector(".project-cta-section");
    expect(cta.querySelector(".cta-buttons")).not.toBeNull();
  });
});

// ── Features section on pages that have one ──────────────────────────────────

const PAGES_WITH_FEATURES = [
  "day-1-llm-ios.html",
  "day-2-claude-peepee.html",
  "day-3-speakskiptype.html",
  "day-4-audtext.html",
  "day-minus-5-wifivision.html",
  "day-6-localbrowsercontrol.html",
  "day-7-reddyhedgefund.html",
  "day-8-stock-analyzer.html",
  "adas-system.html",
  "financial-sentiment.html",
  "healthcare-rag.html",
  "claude-peepee.html",
];

describe.each(PAGES_WITH_FEATURES)(
  ".project-features-section — %s",
  (filename) => {
    let doc;
    beforeEach(() => { doc = loadDoc(filename); });

    it("has .project-features-section", () => {
      expect(doc.querySelector(".project-features-section")).not.toBeNull();
    });

    it("contains at least 3 .feature-card elements", () => {
      expect(
        doc.querySelectorAll(".project-features-section .feature-card").length
      ).toBeGreaterThanOrEqual(3);
    });

    it("each feature-card has an h3 heading", () => {
      const cards = doc.querySelectorAll(".project-features-section .feature-card");
      cards.forEach((card) => {
        const h3 = card.querySelector("h3");
        expect(h3).not.toBeNull();
        expect(h3.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  }
);

// ── Content section (problem/solution) on daily-project pages ────────────────

const PAGES_WITH_CONTENT_SECTION = [
  "day-1-llm-ios.html",
  "day-2-claude-peepee.html",
  "day-3-speakskiptype.html",
  "day-4-audtext.html",
  "day-minus-5-wifivision.html",
  "day-6-localbrowsercontrol.html",
  "day-7-reddyhedgefund.html",
  "day-8-stock-analyzer.html",
  "adas-system.html",
  "financial-sentiment.html",
  "healthcare-rag.html",
  "claude-peepee.html",
];

describe.each(PAGES_WITH_CONTENT_SECTION)(
  "Problem/solution section — %s",
  (filename) => {
    let doc;
    beforeEach(() => { doc = loadDoc(filename); });

    it(".project-content-section exists", () => {
      expect(doc.querySelector(".project-content-section")).not.toBeNull();
    });

    it("has .content-grid inside .project-content-section", () => {
      const section = doc.querySelector(".project-content-section");
      expect(section.querySelector(".content-grid")).not.toBeNull();
    });

    it("has at least 2 .content-block elements", () => {
      expect(
        doc.querySelectorAll(".project-content-section .content-block").length
      ).toBeGreaterThanOrEqual(2);
    });
  }
);

// ── Inline script presence ────────────────────────────────────────────────────

describe.each(ALL_PAGES)("Inline script presence — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it("has at least one inline <script> tag", () => {
    const scripts = doc.querySelectorAll("script:not([src])");
    expect(scripts.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Project-links section hero ────────────────────────────────────────────────

describe.each(ALL_PAGES)("Hero project-links — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".project-links exists inside .project-hero", () => {
    const hero = doc.querySelector(".project-hero");
    expect(hero.querySelector(".project-links")).not.toBeNull();
  });

  it(".project-links contains at least 1 anchor", () => {
    const links = doc.querySelectorAll(".project-hero .project-links a");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Back-link destination ─────────────────────────────────────────────────────

describe.each(ALL_PAGES)("Back-link points to browse.html — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".back-link href contains browse.html", () => {
    const backLink = doc.querySelector(".back-link");
    expect(backLink).not.toBeNull();
    expect(backLink.getAttribute("href")).toMatch(/browse\.html/);
  });
});

// ── Per-project unique content ────────────────────────────────────────────────
// 2 assertions per project: one tech-item span text, one body keyword.

const UNIQUE_CONTENT_CASES = [
  [
    "day-1-llm-ios.html",
    { techItem: "GGUF Format", bodyKeyword: /Qwen3|PocketPal|tokens\/sec/i },
  ],
  [
    "day-2-claude-peepee.html",
    { techItem: "SQLite + FTS5", bodyKeyword: /MCP|JSON-RPC|context overhead/i },
  ],
  [
    "day-3-speakskiptype.html",
    { techItem: "Vosk", bodyKeyword: /Whisper|filler word|cursor/i },
  ],
  [
    "day-4-audtext.html",
    { techItem: "Ollama", bodyKeyword: /Llama 3\.1|transcri|Audtext/i },
  ],
  [
    "day-minus-5-wifivision.html",
    { techItem: null, bodyKeyword: /CSI|ESP32|Channel State/i },
  ],
  [
    "day-6-localbrowsercontrol.html",
    { techItem: "Docker Desktop", bodyKeyword: /WSL2|self-healing|Computer Use/i },
  ],
  [
    "day-7-reddyhedgefund.html",
    { techItem: "LangGraph", bodyKeyword: /Warren Buffett|Cathie Wood|18 .{0,20}agent/i },
  ],
  [
    "day-8-stock-analyzer.html",
    { techItem: "TradingView Charts", bodyKeyword: /candlestick|Bollinger|Kimi K2\.5/i },
  ],
  [
    "adas-system.html",
    { techItem: "TensorFlow", bodyKeyword: /500K\+|SageMaker|OpenCV/i },
  ],
  [
    "financial-sentiment.html",
    { techItem: "Transformers", bodyKeyword: /BERT|earnings call|fine-tun/i },
  ],
  [
    "healthcare-rag.html",
    { techItem: "LangChain", bodyKeyword: /HIPAA|GPT-4|50K\+/i },
  ],
  [
    "claude-peepee.html",
    { techItem: "MCP Protocol", bodyKeyword: /80-90%|cross-session|context overhead/i },
  ],
];

describe.each(UNIQUE_CONTENT_CASES)(
  "Unique content — %s",
  (filename, { techItem, bodyKeyword }) => {
    let doc;
    beforeEach(() => { doc = loadDoc(filename); });

    if (techItem !== null) {
      it(`tech-item span contains "${techItem}"`, () => {
        const spans = [...doc.querySelectorAll(".tech-item span")];
        const texts = spans.map((s) => s.textContent.trim());
        expect(texts.some((t) => t === techItem || t.includes(techItem))).toBe(true);
      });
    } else {
      it("tech section has at least 3 tech-item spans (no specific label)", () => {
        expect(doc.querySelectorAll(".tech-item span").length).toBeGreaterThanOrEqual(3);
      });
    }

    it("body text contains expected unique keyword", () => {
      expect(doc.body.textContent).toMatch(bodyKeyword);
    });
  }
);

// ── Install and architecture sections ─────────────────────────────────────────
// All 12 project pages have both sections (verified from source).

describe.each(ALL_PAGES)("Install section — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it("has .project-install-section", () => {
    expect(doc.querySelector(".project-install-section")).not.toBeNull();
  });

  it(".project-install-section has at least 1 .install-step", () => {
    const section = doc.querySelector(".project-install-section");
    expect(section.querySelectorAll(".install-step").length).toBeGreaterThanOrEqual(1);
  });
});

describe.each(ALL_PAGES)("Architecture section — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it("has .project-architecture-section", () => {
    expect(doc.querySelector(".project-architecture-section")).not.toBeNull();
  });

  it(".project-architecture-section has a section heading", () => {
    const section = doc.querySelector(".project-architecture-section");
    const heading = section.querySelector("h2, h3");
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim().length).toBeGreaterThan(0);
  });
});

// ── External link validation in .project-links and .cta-buttons ──────────────
// Every project links to at least one https:// external URL in those areas.

describe.each(ALL_PAGES)("CTA and hero external links — %s", (filename) => {
  let doc;
  beforeEach(() => { doc = loadDoc(filename); });

  it(".project-links contains at least one external https:// link", () => {
    const links = [...doc.querySelectorAll(".project-links a[href]")];
    const external = links.filter((a) =>
      a.getAttribute("href").startsWith("https://")
    );
    expect(external.length).toBeGreaterThanOrEqual(1);
  });

  it(".cta-buttons contains at least one anchor element", () => {
    const ctaButtons = doc.querySelector(".cta-buttons");
    expect(ctaButtons).not.toBeNull();
    const anchors = ctaButtons.querySelectorAll("a");
    expect(anchors.length).toBeGreaterThanOrEqual(1);
  });

  it("navigational external links in .project-links and .cta-buttons open in new tab (target=_blank)", () => {
    const allLinks = [
      ...doc.querySelectorAll(".project-links a[href]"),
      ...doc.querySelectorAll(".cta-buttons a[href]"),
    ];
    // Exclude file-download links (e.g., .zip) — those don't need target=_blank
    const navExternalLinks = allLinks.filter((a) => {
      const href = a.getAttribute("href");
      return href.startsWith("https://") && !href.endsWith(".zip");
    });
    navExternalLinks.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
    });
  });
});

// ── Image and media elements ──────────────────────────────────────────────────

describe("SVG icons in feature cards — structural check", () => {
  // Pages where feature-icon uses an inline SVG (not an <img>)
  const PAGES_WITH_SVG_FEATURE_ICONS = [
    "day-1-llm-ios.html",
    "day-2-claude-peepee.html",
    "day-3-speakskiptype.html",
    "day-4-audtext.html",
    "day-7-reddyhedgefund.html",
    "day-8-stock-analyzer.html",
    "healthcare-rag.html",
    "claude-peepee.html",
  ];

  it.each(PAGES_WITH_SVG_FEATURE_ICONS)(
    "feature cards contain inline SVG icons — %s",
    (filename) => {
      const doc = loadDoc(filename);
      const featureIcons = doc.querySelectorAll(".feature-icon");
      const svgCount = [...featureIcons].filter(
        (icon) => icon.querySelector("svg") !== null
      ).length;
      expect(svgCount).toBeGreaterThanOrEqual(1);
    }
  );
});

describe("img elements have alt text — pages with <img> in tech grid", () => {
  // Only adas-system.html, healthcare-rag.html, and financial-sentiment.html
  // use <img> tags inside .tech-item for their tech icons.
  const PAGES_WITH_TECH_IMGS = [
    "adas-system.html",
    "healthcare-rag.html",
    "financial-sentiment.html",
  ];

  it.each(PAGES_WITH_TECH_IMGS)(
    "every <img> inside .tech-item has a non-empty alt attribute — %s",
    (filename) => {
      const doc = loadDoc(filename);
      const imgs = doc.querySelectorAll(".tech-item img");
      expect(imgs.length).toBeGreaterThanOrEqual(1);
      imgs.forEach((img) => {
        const alt = img.getAttribute("alt");
        expect(alt).not.toBeNull();
        expect(alt.trim().length).toBeGreaterThan(0);
      });
    }
  );
});

describe("day-minus-5-wifivision.html — no external img elements missing alt", () => {
  it("the one img tag in wifivision has an alt attribute", () => {
    const doc = loadDoc("day-minus-5-wifivision.html");
    const imgs = doc.querySelectorAll("img[alt]");
    // There is at least zero — if any img exists it must have alt
    const imgsNoAlt = doc.querySelectorAll("img:not([alt])");
    expect(imgsNoAlt.length).toBe(0);
  });
});
