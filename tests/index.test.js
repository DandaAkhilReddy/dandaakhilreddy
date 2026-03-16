/**
 * Tests for index.html — Landing page: enter overlay, Netflix intro,
 * floating particles, profile selection, video backgrounds, audio, script
 * behavior (string matching), and CSS rules.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

const htmlPath = resolve(__dirname, "../index.html");
const html = readFileSync(htmlPath, "utf-8");

// Static DOM — no script execution avoids const re-declaration errors.
function createDOM() {
  return new JSDOM(html).window.document;
}

// ── Page Structure ──────────────────────────────────────────────────────────

describe("Page Structure", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("title equals 'Akhil Reddy Danda'", () => {
    expect(doc.title).toBe("Akhil Reddy Danda");
  });

  it("includes a Google Fonts stylesheet link", () => {
    const links = [...doc.querySelectorAll("link[href*='fonts.googleapis']")];
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("has a viewport meta tag", () => {
    const viewport = doc.querySelector("meta[name='viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
  });
});

// ── Enter Overlay ───────────────────────────────────────────────────────────

describe("Enter Overlay", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("exists with id='enter-overlay' and class='enter-overlay'", () => {
    const overlay = doc.getElementById("enter-overlay");
    expect(overlay).not.toBeNull();
    expect(overlay.classList.contains("enter-overlay")).toBe(true);
  });

  it("brand text equals 'AKHIL REDDY DANDA'", () => {
    const brand = doc.querySelector(".enter-brand");
    expect(brand).not.toBeNull();
    expect(brand.textContent.trim()).toBe("AKHIL REDDY DANDA");
  });

  it("prompt text equals 'Click to Enter'", () => {
    const prompt = doc.querySelector(".enter-prompt");
    expect(prompt).not.toBeNull();
    expect(prompt.textContent.trim()).toBe("Click to Enter");
  });
});

// ── Netflix Intro ───────────────────────────────────────────────────────────

describe("Netflix Intro", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("exists with id='netflix-intro' and class='netflix-intro'", () => {
    const intro = doc.getElementById("netflix-intro");
    expect(intro).not.toBeNull();
    expect(intro.classList.contains("netflix-intro")).toBe(true);
  });

  it("logo text equals 'AKHIL REDDY DANDA'", () => {
    const logo = doc.querySelector(".netflix-intro .logo-text");
    expect(logo).not.toBeNull();
    expect(logo.textContent.trim()).toBe("AKHIL REDDY DANDA");
  });

  it("starts without the 'playing' class", () => {
    const intro = doc.getElementById("netflix-intro");
    expect(intro.classList.contains("playing")).toBe(false);
  });
});

// ── Floating Particles ──────────────────────────────────────────────────────

describe("Floating Particles", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it(".particles container exists", () => {
    expect(doc.querySelector(".particles")).not.toBeNull();
  });

  it("contains exactly 12 .particle elements", () => {
    expect(doc.querySelectorAll(".particle").length).toBe(12);
  });
});

// ── Profile Cards ───────────────────────────────────────────────────────────

describe("Profile Cards", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("container #profile-selection exists", () => {
    expect(doc.getElementById("profile-selection")).not.toBeNull();
  });

  it("title equals \"Who's Watching?\"", () => {
    const title = doc.querySelector(".profile-title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe("Who's Watching?");
  });

  it("has exactly 4 .profile-card elements", () => {
    expect(doc.querySelectorAll(".profile-card").length).toBe(4);
  });

  it("card order is Recruiter, Developer, Visitor, Adventurer", () => {
    const names = [...doc.querySelectorAll(".profile-name")].map((el) =>
      el.textContent.trim()
    );
    expect(names).toEqual(["Recruiter", "Developer", "Visitor", "Adventurer"]);
  });

  it("Recruiter href = 'browse.html?profile=recruiter'", () => {
    const card = doc.querySelectorAll(".profile-card")[0];
    expect(card.getAttribute("href")).toBe("browse.html?profile=recruiter");
  });

  it("Developer href = 'browse.html?profile=developer'", () => {
    const card = doc.querySelectorAll(".profile-card")[1];
    expect(card.getAttribute("href")).toBe("browse.html?profile=developer");
  });

  it("Visitor href = 'browse.html?profile=visitor'", () => {
    const card = doc.querySelectorAll(".profile-card")[2];
    expect(card.getAttribute("href")).toBe("browse.html?profile=visitor");
  });

  it("Adventurer href = 'browse.html?profile=adventurer'", () => {
    const card = doc.querySelectorAll(".profile-card")[3];
    expect(card.getAttribute("href")).toBe("browse.html?profile=adventurer");
  });

  it("Recruiter img src = 'assets/whos-watching/RECRUITER_iMAGE.png'", () => {
    const img = doc.querySelectorAll(".profile-avatar img")[0];
    expect(img.getAttribute("src")).toBe(
      "assets/whos-watching/RECRUITER_iMAGE.png"
    );
  });

  it("Developer img src = 'assets/whos-watching/DEVELOPER_IMGE.png'", () => {
    const img = doc.querySelectorAll(".profile-avatar img")[1];
    expect(img.getAttribute("src")).toBe(
      "assets/whos-watching/DEVELOPER_IMGE.png"
    );
  });

  it("Visitor img src = 'assets/whos-watching/STALKER_IMAGE.png'", () => {
    const img = doc.querySelectorAll(".profile-avatar img")[2];
    expect(img.getAttribute("src")).toBe(
      "assets/whos-watching/STALKER_IMAGE.png"
    );
  });

  it("Adventurer img src = 'assets/whos-watching/ADVENTURER_IMAGE.png'", () => {
    const img = doc.querySelectorAll(".profile-avatar img")[3];
    expect(img.getAttribute("src")).toBe(
      "assets/whos-watching/ADVENTURER_IMAGE.png"
    );
  });

  it("each card has .profile-avatar containing an img", () => {
    doc.querySelectorAll(".profile-card").forEach((card) => {
      const avatar = card.querySelector(".profile-avatar");
      expect(avatar).not.toBeNull();
      const img = avatar.querySelector("img");
      expect(img).not.toBeNull();
      expect(img.getAttribute("src")).toBeTruthy();
    });
  });
});

// ── Audio ───────────────────────────────────────────────────────────────────

describe("Audio", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("#netflix-sound audio element exists", () => {
    const audio = doc.getElementById("netflix-sound");
    expect(audio).not.toBeNull();
    expect(audio.tagName.toLowerCase()).toBe("audio");
  });

  it("source src = 'assets/netflix-sound.mp3' and type = 'audio/mpeg'", () => {
    const source = doc.querySelector("#netflix-sound source");
    expect(source).not.toBeNull();
    expect(source.getAttribute("src")).toBe("assets/netflix-sound.mp3");
    expect(source.getAttribute("type")).toBe("audio/mpeg");
  });

  it("audio element has preload='auto' attribute", () => {
    const audio = doc.getElementById("netflix-sound");
    expect(audio.getAttribute("preload")).toBe("auto");
  });
});

// ── Video / Audio Elements ───────────────────────────────────────────────────

describe("Video / Audio Elements", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("page has no <video> element (background video only in browse.html)", () => {
    const videos = doc.querySelectorAll("video");
    expect(videos.length).toBe(0);
  });

  it("audio element has no src attribute on the element itself (uses <source> child)", () => {
    const audio = doc.getElementById("netflix-sound");
    expect(audio).not.toBeNull();
    // src should be absent from the <audio> tag; it lives on the <source> child
    expect(audio.hasAttribute("src")).toBe(false);
  });

  it("audio <source> child has type='audio/mpeg'", () => {
    const source = doc.querySelector("#netflix-sound source");
    expect(source).not.toBeNull();
    expect(source.getAttribute("type")).toBe("audio/mpeg");
  });
});

// ── Profile Card Link Validation ─────────────────────────────────────────────

describe("Profile Card Link Validation", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("all 4 profile cards have href matching 'browse.html?profile=<name>' pattern", () => {
    const cards = [...doc.querySelectorAll(".profile-card[href]")];
    expect(cards.length).toBe(4);
    cards.forEach((card) => {
      expect(card.getAttribute("href")).toMatch(
        /^browse\.html\?profile=(recruiter|developer|visitor|adventurer)$/
      );
    });
  });

  it("profile card hrefs cover all 4 distinct profile names exactly once", () => {
    const cards = [...doc.querySelectorAll(".profile-card[href]")];
    const profiles = cards.map((c) =>
      new URLSearchParams(c.getAttribute("href").split("?")[1]).get("profile")
    );
    expect(profiles.sort()).toEqual(
      ["adventurer", "developer", "recruiter", "visitor"]
    );
  });
});

// ── Script Behavior ─────────────────────────────────────────────────────────

describe("Script Behavior", () => {
  let scriptContent;
  beforeAll(() => {
    const doc = createDOM();
    const scripts = [...doc.querySelectorAll("script")];
    // The inline script references 'enter-overlay' and drives all interactions.
    const target = scripts.find((s) =>
      s.textContent.includes("enter-overlay")
    );
    scriptContent = target ? target.textContent : "";
  });

  it("registers click listener on overlay via overlay.addEventListener('click'", () => {
    expect(scriptContent).toContain("overlay.addEventListener('click'");
  });

  it("adds 'hidden' class to overlay on click", () => {
    expect(scriptContent).toContain("classList.add('hidden')");
  });

  it("adds 'playing' class to trigger Netflix intro", () => {
    expect(scriptContent).toContain("classList.add('playing')");
  });

  it("calls sound.play() on overlay click", () => {
    expect(scriptContent).toContain("sound.play()");
  });

  it("adds 'visible' class to profileSelection after intro", () => {
    expect(scriptContent).toContain("profileSelection.classList.add('visible')");
  });

  it("applies scale(1.2) transform on profile card click", () => {
    expect(scriptContent).toContain("scale(1.2)");
  });

  it("navigates via window.location.href = href", () => {
    expect(scriptContent).toContain("window.location.href = href");
  });

  it("setTimeout uses 3500ms delay for profile reveal", () => {
    expect(scriptContent).toContain("3500");
  });

  it("calls e.preventDefault() on profile card click", () => {
    expect(scriptContent).toContain("e.preventDefault()");
  });

  it("reads card href via card.getAttribute('href')", () => {
    expect(scriptContent).toContain("card.getAttribute('href')");
  });

  it("selects all profile cards via document.querySelectorAll('.profile-card')", () => {
    expect(scriptContent).toContain("document.querySelectorAll('.profile-card')");
  });
});

// ── CSS Rules ───────────────────────────────────────────────────────────────

describe("CSS Rules", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    const styles = [...doc.querySelectorAll("style")];
    styleContent = styles.map((s) => s.textContent).join("\n");
  });

  it("style tag contains .enter-overlay rules", () => {
    expect(styleContent).toContain(".enter-overlay");
  });

  it("includes @media (max-width: 768px) breakpoint", () => {
    expect(styleContent).toContain("max-width: 768px");
  });

  it("includes @media (max-width: 480px) breakpoint", () => {
    expect(styleContent).toContain("max-width: 480px");
  });

  it(".profile-avatar has position: relative", () => {
    expect(styleContent).toMatch(/\.profile-avatar\s*\{[^}]*position:\s*relative/s);
  });

  it("768px media query contains profile-title font-size override", () => {
    const block768 = styleContent.match(/@media\s*\(max-width:\s*768px\)[^{]*\{([\s\S]*?)(?=@media|$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toContain("font-size");
    expect(block768[1]).toContain("profile-title");
  });

  it("768px media query contains profile-avatar width and height overrides", () => {
    const block768 = styleContent.match(/@media\s*\(max-width:\s*768px\)[^{]*\{([\s\S]*?)(?=@media|$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toContain("profile-avatar");
    expect(block768[1]).toMatch(/width:\s*100px/);
    expect(block768[1]).toMatch(/height:\s*100px/);
  });

  it("768px media query contains logo-text font-size override", () => {
    const block768 = styleContent.match(/@media\s*\(max-width:\s*768px\)[^{]*\{([\s\S]*?)(?=@media|$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toContain("logo-text");
    expect(block768[1]).toContain("font-size");
  });

  it("768px media query contains enter-brand font-size override", () => {
    const block768 = styleContent.match(/@media\s*\(max-width:\s*768px\)[^{]*\{([\s\S]*?)(?=@media|$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toContain("enter-brand");
    expect(block768[1]).toContain("font-size");
  });

  it("480px media query contains grid-template-columns", () => {
    const block480 = styleContent.match(/@media\s*\(max-width:\s*480px\)[^{]*\{([\s\S]*?)(?=@media|$)/);
    expect(block480).not.toBeNull();
    expect(block480[1]).toContain("grid-template-columns");
  });
});

// ── Accessibility ────────────────────────────────────────────────────────────

describe("Accessibility", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("html element has lang='en'", () => {
    const htmlEl = doc.documentElement;
    expect(htmlEl.getAttribute("lang")).toBe("en");
  });

  it("meta charset='UTF-8' exists", () => {
    const charset = doc.querySelector("meta[charset]");
    expect(charset).not.toBeNull();
    expect(charset.getAttribute("charset").toUpperCase()).toBe("UTF-8");
  });

  it("all img elements have non-empty alt attributes", () => {
    const images = [...doc.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => {
      const alt = img.getAttribute("alt");
      expect(alt).not.toBeNull();
      expect(alt.trim().length).toBeGreaterThan(0);
    });
  });

  it("title element is non-empty", () => {
    expect(doc.title.trim().length).toBeGreaterThan(0);
  });

  it("page has exactly one h1 element", () => {
    const h1s = doc.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
  });
});

// ── CSS Animations ───────────────────────────────────────────────────────────

describe("CSS Animations", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    const styles = [...doc.querySelectorAll("style")];
    styleContent = styles.map((s) => s.textContent).join("\n");
  });

  it("style contains @keyframes brandPulse", () => {
    expect(styleContent).toContain("@keyframes brandPulse");
  });

  it("style contains @keyframes promptFade", () => {
    expect(styleContent).toContain("@keyframes promptFade");
  });

  it("style contains @keyframes logoZoom", () => {
    expect(styleContent).toContain("@keyframes logoZoom");
  });

  it("style contains @keyframes fadeOutIntro", () => {
    expect(styleContent).toContain("@keyframes fadeOutIntro");
  });

  it("style contains @keyframes floatUp", () => {
    expect(styleContent).toContain("@keyframes floatUp");
  });

  it("style contains @keyframes fadeIn", () => {
    expect(styleContent).toContain("@keyframes fadeIn");
  });

  it(".enter-overlay.hidden rule has opacity: 0", () => {
    expect(styleContent).toMatch(/\.enter-overlay\.hidden\s*\{[^}]*opacity:\s*0/s);
  });
});

// ── CSS State Classes ─────────────────────────────────────────────────────────

describe("CSS State Classes", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    const styles = [...doc.querySelectorAll("style")];
    styleContent = styles.map((s) => s.textContent).join("\n");
  });

  it(".netflix-intro.playing rule exists in styles", () => {
    expect(styleContent).toContain(".netflix-intro.playing");
  });

  it(".profile-selection.visible rule exists in styles", () => {
    expect(styleContent).toContain(".profile-selection.visible");
  });

  it(".profile-card:hover .profile-avatar rule exists", () => {
    expect(styleContent).toContain(".profile-card:hover .profile-avatar");
  });

  it(".profile-card:hover .profile-name rule exists", () => {
    expect(styleContent).toContain(".profile-card:hover .profile-name");
  });
});

// ── Particle Details ──────────────────────────────────────────────────────────

describe("Particle Details", () => {
  let doc;
  let styleContent;
  beforeEach(() => {
    doc = createDOM();
    styleContent = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join("\n");
  });

  it(".particles container has position: fixed in CSS", () => {
    expect(styleContent).toMatch(/\.particles\s*\{[^}]*position:\s*fixed/s);
  });

  it(".particles container has z-index: 0 in CSS", () => {
    expect(styleContent).toMatch(/\.particles\s*\{[^}]*z-index:\s*0/s);
  });

  it(".particle elements have position: absolute in CSS", () => {
    expect(styleContent).toMatch(/\.particle\s*\{[^}]*position:\s*absolute/s);
  });

  it(".particle rule includes opacity property", () => {
    expect(styleContent).toMatch(/\.particle\s*\{[^}]*opacity:/s);
  });

  it(".particle rule includes animation: floatUp", () => {
    expect(styleContent).toMatch(/\.particle\s*\{[^}]*animation:\s*floatUp/s);
  });

  it("particle nth-child rules specify varying sizes (3px and 5px variants exist)", () => {
    expect(styleContent).toContain("width: 3px");
    expect(styleContent).toContain("width: 5px");
  });

  it("particle nth-child rules specify at least 3 different animation-delay values", () => {
    // Extract delay values from nth-child rules
    const delayMatches = styleContent.match(/animation-delay:\s*[\d.]+s/g) || [];
    const uniqueDelays = new Set(delayMatches);
    expect(uniqueDelays.size).toBeGreaterThanOrEqual(3);
  });

  it("particle colors include solid #E50914 red", () => {
    expect(styleContent).toContain("background: #E50914");
  });

  it("particle colors include rgba white variants", () => {
    expect(styleContent).toContain("rgba(255,255,255");
  });

  it("particle colors include rgba red variants", () => {
    expect(styleContent).toContain("rgba(229, 9, 20");
  });
});

// ── Overlay Animation CSS ─────────────────────────────────────────────────────

describe("Overlay Animation CSS", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    styleContent = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join("\n");
  });

  it(".enter-overlay background is a radial-gradient", () => {
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*radial-gradient/s);
  });

  it(".enter-overlay.hidden has pointer-events: none", () => {
    expect(styleContent).toMatch(/\.enter-overlay\.hidden\s*\{[^}]*pointer-events:\s*none/s);
  });

  it(".enter-overlay has a transition property", () => {
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*transition:/s);
  });

  it(".enter-overlay has z-index: 2000", () => {
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*z-index:\s*2000/s);
  });

  it(".enter-overlay covers full viewport with width: 100% and height: 100%", () => {
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*width:\s*100%/s);
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*height:\s*100%/s);
  });

  it(".enter-overlay has cursor: pointer", () => {
    expect(styleContent).toMatch(/\.enter-overlay\s*\{[^}]*cursor:\s*pointer/s);
  });
});

// ── Netflix Intro CSS Details ─────────────────────────────────────────────────

describe("Netflix Intro CSS Details", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    styleContent = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join("\n");
  });

  it(".netflix-intro.playing .logo-text rule applies logoZoom animation", () => {
    expect(styleContent).toMatch(/\.netflix-intro\.playing\s+\.logo-text[\s\S]*?logoZoom/);
  });

  it("style contains logoZoom animation reference in @keyframes", () => {
    expect(styleContent).toContain("@keyframes logoZoom");
  });

  it(".netflix-intro starts with opacity: 0 and visibility: hidden", () => {
    expect(styleContent).toMatch(/\.netflix-intro\s*\{[^}]*opacity:\s*0/s);
    expect(styleContent).toMatch(/\.netflix-intro\s*\{[^}]*visibility:\s*hidden/s);
  });

  it(".netflix-intro has z-index: 1000", () => {
    expect(styleContent).toMatch(/\.netflix-intro\s*\{[^}]*z-index:\s*1000/s);
  });

  it(".logo-text has color: #E50914", () => {
    expect(styleContent).toMatch(/\.logo-text[\s\S]*?color:\s*#E50914/);
  });

  it(".logo-text has font-size: 4rem", () => {
    expect(styleContent).toMatch(/\.logo-text[\s\S]*?font-size:\s*4rem/);
  });
});

// ── Profile Card CSS Details ──────────────────────────────────────────────────

describe("Profile Card CSS Details", () => {
  let styleContent;
  beforeAll(() => {
    const doc = createDOM();
    styleContent = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join("\n");
  });

  it(".profile-avatar has width: 150px and height: 150px", () => {
    expect(styleContent).toMatch(/\.profile-avatar\s*\{[^}]*width:\s*150px/s);
    expect(styleContent).toMatch(/\.profile-avatar\s*\{[^}]*height:\s*150px/s);
  });

  it(".profile-card has text-decoration: none", () => {
    expect(styleContent).toMatch(/\.profile-card\s*\{[^}]*text-decoration:\s*none/s);
  });

  it(".profile-card:hover .profile-avatar has transform: scale(1.1)", () => {
    expect(styleContent).toMatch(/\.profile-card:hover\s+\.profile-avatar[\s\S]*?transform:\s*scale\(1\.1\)/);
  });

  it(".profiles-container uses display: flex layout", () => {
    expect(styleContent).toMatch(/\.profiles-container\s*\{[^}]*display:\s*flex/s);
  });
});

// ── Script Timing Details ─────────────────────────────────────────────────────

describe("Script Timing Details", () => {
  let scriptContent;
  beforeAll(() => {
    const doc = createDOM();
    const scripts = [...doc.querySelectorAll("script")];
    const target = scripts.find((s) =>
      s.textContent.includes("enter-overlay")
    );
    scriptContent = target ? target.textContent : "";
  });

  it("script contains setTimeout with 300ms delay for card click navigation", () => {
    expect(scriptContent).toContain("300");
  });

  it("script uses forEach to iterate over all profile cards", () => {
    expect(scriptContent).toContain(".forEach");
  });

  it("script has .catch for sound.play() error handling", () => {
    expect(scriptContent).toContain(".catch(");
  });

  it("script runs inline at end of body without DOMContentLoaded wrapper", () => {
    // Scripts that run inline do not need DOMContentLoaded
    // Verify the script does NOT wrap in DOMContentLoaded
    expect(scriptContent).not.toContain("DOMContentLoaded");
  });
});
