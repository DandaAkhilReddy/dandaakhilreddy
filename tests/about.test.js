/**
 * Tests for about.html — Profile page: hero, bio, passions, connect section,
 * lightbox, navigation, and CSS. Uses static JSDOM (no script execution).
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

const htmlPath = resolve(__dirname, "../about.html");
const html = readFileSync(htmlPath, "utf-8");

function createDOM() {
  return new JSDOM(html).window.document;
}

// ── Page Structure ───────────────────────────────────────────────────────────

describe("Page Structure", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("has a non-empty title", () => {
    expect(doc.title).toBeTruthy();
  });

  it("loads Google Fonts via a stylesheet link", () => {
    const links = [...doc.querySelectorAll("link[href*='fonts.googleapis']")];
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("has a viewport meta tag", () => {
    const viewport = doc.querySelector("meta[name='viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
  });
});

// ── Navigation ───────────────────────────────────────────────────────────────

describe("Navigation", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("has a nav logo / brand link", () => {
    const logo = doc.querySelector("nav .nav-logo, nav a.nav-logo");
    expect(logo).not.toBeNull();
    expect(logo.textContent.trim()).toBeTruthy();
  });

  it("nav links reference browse.html for section anchors", () => {
    const navLinks = [...doc.querySelectorAll("nav a[href]")];
    const browseLinks = navLinks.filter((a) =>
      a.getAttribute("href").includes("browse.html")
    );
    expect(browseLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("About Me nav link exists and is marked active", () => {
    const aboutLink = doc.querySelector("nav a[href='about.html']");
    expect(aboutLink).not.toBeNull();
    expect(aboutLink.classList.contains("active")).toBe(true);
  });

  it("profile icon / link is present in nav", () => {
    const profileIcon = doc.querySelector(
      "nav .profile-icon, nav a .nav-profile-img, nav .nav-right a"
    );
    expect(profileIcon).not.toBeNull();
  });
});

// ── Hero Section ─────────────────────────────────────────────────────────────

describe("Hero Section", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("profile image src equals 'assets/profile/Profilepicture.jpeg'", () => {
    const img = doc.querySelector(".about-hero img");
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("assets/profile/Profilepicture.jpeg");
  });

  it("hero h1 contains 'DANDA AKHIL REDDY'", () => {
    const h1 = doc.querySelector(".about-hero h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent).toMatch(/DANDA AKHIL REDDY|AKHIL REDDY/i);
  });

  it("tagline mentions Microsoft", () => {
    const tagline = doc.querySelector(".about-hero .tagline");
    expect(tagline).not.toBeNull();
    expect(tagline.textContent).toContain("Microsoft");
  });

  it("profile image has non-empty alt text", () => {
    const img = doc.querySelector(".about-hero img");
    expect(img).not.toBeNull();
    expect(img.getAttribute("alt")).toBeTruthy();
  });
});

// ── Bio Section ──────────────────────────────────────────────────────────────

describe("Bio Section", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("bio section contains an image", () => {
    const bioImg = doc.querySelector(".bio-section img, .bio-profile-image img");
    expect(bioImg).not.toBeNull();
  });

  it("bio text content is non-empty", () => {
    const bioContent = doc.querySelector(".bio-content");
    expect(bioContent).not.toBeNull();
    expect(bioContent.textContent.trim().length).toBeGreaterThan(0);
  });
});

// ── Passions Section ─────────────────────────────────────────────────────────

describe("Passions Section", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("has exactly 3 passion cards", () => {
    const cards = doc.querySelectorAll(".passion-card");
    expect(cards.length).toBe(3);
  });

  it("LLM Fine-tuning card exists", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const llmCard = cards.find((c) =>
      /LLM|Fine.?tuning/i.test(c.innerHTML)
    );
    expect(llmCard).toBeDefined();
  });

  it("AI/ML Research card exists", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const researchCard = cards.find((c) => /Research/i.test(c.innerHTML));
    expect(researchCard).toBeDefined();
  });

  it("Cricket card exists", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const cricketCard = cards.find((c) => /Cricket/i.test(c.innerHTML));
    expect(cricketCard).toBeDefined();
  });

  it("cricket stats link points to cricclubs.com", () => {
    const cricketLink = doc.querySelector("a[href*='cricclubs.com']");
    expect(cricketLink).not.toBeNull();
  });

  it("cricket gallery contains exactly 2 images", () => {
    const galleryImgs = doc.querySelectorAll(".cricket-gallery img");
    expect(galleryImgs.length).toBe(2);
  });

  it("cricket gallery images are inside or alongside clickable containers", () => {
    // The script attaches click listeners; verify via onclick attrs on wrapper
    // or that the gallery images themselves carry cursor styling via the script.
    // We validate the lightbox infrastructure is wired to the gallery.
    const galleryImgs = [...doc.querySelectorAll(".cricket-gallery img")];
    expect(galleryImgs.length).toBeGreaterThan(0);
    // The script adds event listeners — check script source instead.
    const scriptContent = html;
    expect(scriptContent).toContain("openLightbox");
    expect(scriptContent).toContain("cricket-gallery");
  });

  it("cricket gallery images have alt text", () => {
    const galleryImgs = [...doc.querySelectorAll(".cricket-gallery img")];
    galleryImgs.forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
    });
  });
});

// ── Connect Section ──────────────────────────────────────────────────────────

describe("Connect Section", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("has an email mailto link", () => {
    const mailto = doc.querySelector("a[href^='mailto:']");
    expect(mailto).not.toBeNull();
  });

  it("has a LinkedIn link that opens in a new tab", () => {
    const linkedin = doc.querySelector("a[href*='linkedin.com']");
    expect(linkedin).not.toBeNull();
    expect(linkedin.getAttribute("target")).toBe("_blank");
  });

  it("has a GitHub link that opens in a new tab", () => {
    const github = doc.querySelector("a[href*='github.com']");
    expect(github).not.toBeNull();
    expect(github.getAttribute("target")).toBe("_blank");
  });
});

// ── Lightbox ─────────────────────────────────────────────────────────────────

describe("Lightbox", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("#imageLightbox element exists", () => {
    const lightbox = doc.getElementById("imageLightbox");
    expect(lightbox).not.toBeNull();
  });

  it("has a close button with the × character", () => {
    const closeBtn = doc.querySelector(
      ".lightbox-close, button[onclick*='closeLightbox']"
    );
    expect(closeBtn).not.toBeNull();
    // The × char is rendered as &times; — check raw html or textContent
    expect(closeBtn.textContent.trim()).toMatch(/×|✕|✖|close/i);
  });

  it("has previous and next navigation buttons", () => {
    const prev = doc.querySelector(".lightbox-prev");
    const next = doc.querySelector(".lightbox-next");
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
  });

  it("script contains 'openLightbox' function definition", () => {
    expect(html).toContain("openLightbox");
  });

  it("script handles keyboard navigation with Escape and ArrowLeft", () => {
    expect(html).toContain("Escape");
    expect(html).toContain("ArrowLeft");
  });
});

// ── Back Link ────────────────────────────────────────────────────────────────

describe("Back Link", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("page has a link back to browse.html", () => {
    const backLink = doc.querySelector("a[href='browse.html'], a[href*='browse.html']");
    expect(backLink).not.toBeNull();
  });
});

// ── CSS ──────────────────────────────────────────────────────────────────────

describe("CSS", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("has an inline <style> tag", () => {
    const style = doc.querySelector("style");
    expect(style).not.toBeNull();
  });

  it("inline styles include a @media responsive breakpoint", () => {
    const styles = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join(" ");
    expect(styles).toContain("@media");
  });
});
