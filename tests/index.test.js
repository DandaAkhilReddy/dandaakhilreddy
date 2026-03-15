/**
 * Tests for index.html — Landing page with click-to-enter overlay,
 * Netflix intro animation, and profile selection.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

const htmlPath = resolve(__dirname, "../index.html");
const html = readFileSync(htmlPath, "utf-8");

function createDOM() {
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
  return dom.window.document;
}

function createStaticDOM() {
  const dom = new JSDOM(html);
  return dom.window.document;
}

describe("index.html — Profile Selection Page", () => {
  let doc;

  beforeEach(() => {
    doc = createStaticDOM();
  });

  // ── Structure ──────────────────────────────────────────────

  describe("page structure", () => {
    it("has correct page title", () => {
      expect(doc.title).toBe("Akhil Reddy Danda");
    });

    it("loads Inter and Bebas Neue fonts", () => {
      const links = [...doc.querySelectorAll('link[href*="fonts.googleapis"]')];
      expect(links.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Enter Overlay ──────────────────────────────────────────

  describe("enter overlay", () => {
    it("exists with correct id and class", () => {
      const overlay = doc.getElementById("enter-overlay");
      expect(overlay).not.toBeNull();
      expect(overlay.classList.contains("enter-overlay")).toBe(true);
    });

    it("displays brand name", () => {
      const brand = doc.querySelector(".enter-brand");
      expect(brand).not.toBeNull();
      expect(brand.textContent).toBe("AKHIL REDDY DANDA");
    });

    it('shows "Click to Enter" prompt', () => {
      const prompt = doc.querySelector(".enter-prompt");
      expect(prompt).not.toBeNull();
      expect(prompt.textContent).toBe("Click to Enter");
    });
  });

  // ── Netflix Intro ──────────────────────────────────────────

  describe("netflix intro", () => {
    it("exists with correct id and class", () => {
      const intro = doc.getElementById("netflix-intro");
      expect(intro).not.toBeNull();
      expect(intro.classList.contains("netflix-intro")).toBe(true);
    });

    it("contains logo text with correct name", () => {
      const logo = doc.querySelector(".netflix-intro .logo-text");
      expect(logo).not.toBeNull();
      expect(logo.textContent).toBe("AKHIL REDDY DANDA");
    });

    it("starts without playing class", () => {
      const intro = doc.getElementById("netflix-intro");
      expect(intro.classList.contains("playing")).toBe(false);
    });
  });

  // ── Floating Particles ─────────────────────────────────────

  describe("floating particles", () => {
    it("has particles container", () => {
      expect(doc.querySelector(".particles")).not.toBeNull();
    });

    it("contains exactly 12 particles", () => {
      expect(doc.querySelectorAll(".particle").length).toBe(12);
    });
  });

  // ── Profile Cards ──────────────────────────────────────────

  describe("profile selection", () => {
    it("has profile selection container", () => {
      expect(doc.getElementById("profile-selection")).not.toBeNull();
    });

    it('shows "Who\'s Watching?" title', () => {
      const title = doc.querySelector(".profile-title");
      expect(title.textContent).toBe("Who's Watching?");
    });

    it("has exactly 3 profile cards", () => {
      expect(doc.querySelectorAll(".profile-card").length).toBe(3);
    });

    it("profile cards are in correct order: Backend, LLM Researcher, Cricket", () => {
      const names = [...doc.querySelectorAll(".profile-name")].map(
        (el) => el.textContent
      );
      expect(names).toEqual(["Backend", "LLM Researcher", "Cricket"]);
    });

    it("Backend card links to browse.html?profile=backend", () => {
      const card = doc.querySelectorAll(".profile-card")[0];
      expect(card.getAttribute("href")).toBe("browse.html?profile=backend");
    });

    it("LLM Researcher card links to browse.html?profile=researcher", () => {
      const card = doc.querySelectorAll(".profile-card")[1];
      expect(card.getAttribute("href")).toBe("browse.html?profile=researcher");
    });

    it("Cricket card links to browse.html?profile=cricket", () => {
      const card = doc.querySelectorAll(".profile-card")[2];
      expect(card.getAttribute("href")).toBe("browse.html?profile=cricket");
    });

    it("Backend card uses Developer avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[0];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/DEVELOPER_IMGE.png");
    });

    it("LLM Researcher card uses Recruiter avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[1];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/RECRUITER_iMAGE.png");
    });

    it("Cricket card uses Adventurer avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[2];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/ADVENTURER_IMAGE.png");
    });

    it("each profile card has an avatar with img", () => {
      doc.querySelectorAll(".profile-card").forEach((card) => {
        const avatar = card.querySelector(".profile-avatar");
        expect(avatar).not.toBeNull();
        const img = avatar.querySelector("img");
        expect(img).not.toBeNull();
        expect(img.getAttribute("src")).toBeTruthy();
      });
    });
  });

  // ── Audio ──────────────────────────────────────────────────

  describe("netflix sound", () => {
    it("has audio element with correct id", () => {
      const audio = doc.getElementById("netflix-sound");
      expect(audio).not.toBeNull();
      expect(audio.tagName.toLowerCase()).toBe("audio");
    });

    it("audio source points to netflix-sound.mp3", () => {
      const source = doc.querySelector("#netflix-sound source");
      expect(source).not.toBeNull();
      expect(source.getAttribute("src")).toBe("assets/netflix-sound.mp3");
      expect(source.getAttribute("type")).toBe("audio/mpeg");
    });
  });

  // ── Script Logic ───────────────────────────────────────────

  describe("script behavior", () => {
    it("script registers click listener on enter-overlay", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("enter-overlay")
      );
      expect(mainScript).toBeTruthy();
      expect(mainScript.textContent).toContain("overlay.addEventListener('click'");
    });

    it("script adds hidden class to overlay on click", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("classList.add('hidden')")
      );
      expect(mainScript).toBeTruthy();
    });

    it("script triggers Netflix intro with playing class", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("classList.add('playing')")
      );
      expect(mainScript).toBeTruthy();
    });

    it("script plays netflix sound on overlay click", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("sound.play()")
      );
      expect(mainScript).toBeTruthy();
    });

    it("script shows profile selection after intro", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("profileSelection.classList.add('visible')")
      );
      expect(mainScript).toBeTruthy();
    });

    it("profile card click triggers scale animation", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("scale(1.2)")
      );
      expect(mainScript).toBeTruthy();
    });

    it("profile card click navigates after delay", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("window.location.href = href")
      );
      expect(mainScript).toBeTruthy();
    });
  });
});
