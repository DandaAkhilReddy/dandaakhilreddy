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
});
