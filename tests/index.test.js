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

    it("has exactly 4 profile cards", () => {
      expect(doc.querySelectorAll(".profile-card").length).toBe(4);
    });

    it("profile cards are in correct order: Recruiter, Developer, Visitor, Adventurer", () => {
      const names = [...doc.querySelectorAll(".profile-name")].map(
        (el) => el.textContent
      );
      expect(names).toEqual(["Recruiter", "Developer", "Visitor", "Adventurer"]);
    });

    it("Recruiter card links to browse.html?profile=recruiter", () => {
      const card = doc.querySelectorAll(".profile-card")[0];
      expect(card.getAttribute("href")).toBe("browse.html?profile=recruiter");
    });

    it("Developer card links to browse.html?profile=developer", () => {
      const card = doc.querySelectorAll(".profile-card")[1];
      expect(card.getAttribute("href")).toBe("browse.html?profile=developer");
    });

    it("Visitor card links to browse.html?profile=visitor", () => {
      const card = doc.querySelectorAll(".profile-card")[2];
      expect(card.getAttribute("href")).toBe("browse.html?profile=visitor");
    });

    it("Adventurer card links to browse.html?profile=adventurer", () => {
      const card = doc.querySelectorAll(".profile-card")[3];
      expect(card.getAttribute("href")).toBe("browse.html?profile=adventurer");
    });

    it("Recruiter card uses correct avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[0];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/RECRUITER_iMAGE.png");
    });

    it("Developer card uses correct avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[1];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/DEVELOPER_IMGE.png");
    });

    it("Visitor card uses correct avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[2];
      expect(img.getAttribute("src")).toBe("assets/whos-watching/STALKER_IMAGE.png");
    });

    it("Adventurer card uses correct avatar image", () => {
      const img = doc.querySelectorAll(".profile-avatar img")[3];
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

  // ── Profile Card Video Backgrounds ────────────────────────

  describe("profile card video backgrounds", () => {
    it("each profile card has a background video", () => {
      doc.querySelectorAll(".profile-avatar").forEach((avatar) => {
        const video = avatar.querySelector("video.avatar-bg-video");
        expect(video).not.toBeNull();
      });
    });

    it("background videos have autoplay, muted, loop attributes", () => {
      doc.querySelectorAll(".avatar-bg-video").forEach((video) => {
        expect(video.hasAttribute("autoplay")).toBe(true);
        expect(video.hasAttribute("muted")).toBe(true);
        expect(video.hasAttribute("loop")).toBe(true);
        expect(video.hasAttribute("playsinline")).toBe(true);
      });
    });

    it("each background video has an MP4 source", () => {
      doc.querySelectorAll(".avatar-bg-video").forEach((video) => {
        const source = video.querySelector("source");
        expect(source).not.toBeNull();
        expect(source.getAttribute("type")).toBe("video/mp4");
        expect(source.getAttribute("src")).toBeTruthy();
      });
    });

    it("each profile card has a dark overlay", () => {
      doc.querySelectorAll(".profile-avatar").forEach((avatar) => {
        const overlay = avatar.querySelector(".avatar-overlay");
        expect(overlay).not.toBeNull();
      });
    });

    it("avatar image is still present above video", () => {
      doc.querySelectorAll(".profile-avatar").forEach((avatar) => {
        const img = avatar.querySelector("img");
        expect(img).not.toBeNull();
        expect(img.getAttribute("src")).toBeTruthy();
      });
    });

    it("Recruiter card has Wolf of Wall Street video", () => {
      const source = doc.querySelectorAll(".avatar-bg-video source")[0];
      expect(source.getAttribute("src")).toContain("wolf-of-wall-street");
    });

    it("Developer card has Hackerman video", () => {
      const source = doc.querySelectorAll(".avatar-bg-video source")[1];
      expect(source.getAttribute("src")).toContain("hackerman");
    });

    it("Visitor card has SpongeBob video", () => {
      const source = doc.querySelectorAll(".avatar-bg-video source")[2];
      expect(source.getAttribute("src")).toContain("spongebob");
    });

    it("Adventurer card has Indiana Jones video", () => {
      const source = doc.querySelectorAll(".avatar-bg-video source")[3];
      expect(source.getAttribute("src")).toContain("giphy.mp4");
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
