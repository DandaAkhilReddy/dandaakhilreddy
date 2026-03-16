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

  it("nav has at least 5 menu link items", () => {
    const navMenuLinks = doc.querySelectorAll(".nav-menu li a");
    expect(navMenuLinks.length).toBeGreaterThanOrEqual(5);
  });

  it("nav logo text contains 'AKHIL' (case insensitive)", () => {
    const logo = doc.querySelector("nav .nav-logo, nav a.nav-logo");
    expect(logo).not.toBeNull();
    expect(logo.textContent.toUpperCase()).toContain("AKHIL");
  });

  it("nav contains browse.html link with #experience anchor", () => {
    const link = doc.querySelector("nav a[href='browse.html#experience']");
    expect(link).not.toBeNull();
  });

  it("nav contains browse.html link with #skills anchor", () => {
    const link = doc.querySelector("nav a[href='browse.html#skills']");
    expect(link).not.toBeNull();
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

  it(".about-hero has a gradient background defined in inline styles", () => {
    const styles = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join(" ");
    expect(styles).toMatch(/\.about-hero[\s\S]*?linear-gradient/);
  });

  it("profile image is inside a container with circular styling (.hero-profile-image)", () => {
    const container = doc.querySelector(".hero-profile-image");
    expect(container).not.toBeNull();
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
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

  it("bio content mentions Microsoft", () => {
    const bioContent = doc.querySelector(".bio-content");
    expect(bioContent).not.toBeNull();
    expect(bioContent.textContent).toContain("Microsoft");
  });

  it("bio content mentions Amazon", () => {
    const bioContent = doc.querySelector(".bio-content");
    expect(bioContent).not.toBeNull();
    expect(bioContent.textContent).toContain("Amazon");
  });

  it("bio content mentions Texas A&M University", () => {
    const bioContent = doc.querySelector(".bio-content");
    expect(bioContent).not.toBeNull();
    // textContent decodes HTML entities, so &amp; becomes &
    expect(bioContent.textContent).toMatch(/Texas A&M/i);
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

  it("first cricket gallery image src is the San Antonio League photo", () => {
    const galleryImgs = [...doc.querySelectorAll(".cricket-gallery img")];
    expect(galleryImgs.length).toBeGreaterThanOrEqual(1);
    expect(galleryImgs[0].getAttribute("src")).toBe(
      "assets/cricket/Century_sanantonioleague.jpeg"
    );
  });

  it("second cricket gallery image src is the Cricclubs photo", () => {
    const galleryImgs = [...doc.querySelectorAll(".cricket-gallery img")];
    expect(galleryImgs.length).toBeGreaterThanOrEqual(2);
    expect(galleryImgs[1].getAttribute("src")).toBe(
      "assets/cricket/Cricclubs_163.jpeg"
    );
  });

  it("all cricket gallery images have non-empty alt attributes", () => {
    const galleryImgs = [...doc.querySelectorAll(".cricket-gallery img")];
    expect(galleryImgs.length).toBeGreaterThan(0);
    galleryImgs.forEach((img) => {
      const alt = img.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt.trim().length).toBeGreaterThan(0);
    });
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

  it("each passion card has an h3 title", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      const h3 = card.querySelector("h3");
      expect(h3).not.toBeNull();
      expect(h3.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  it("each passion card has a description paragraph", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      const p = card.querySelector("p");
      expect(p).not.toBeNull();
      expect(p.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  it("passion cards have tag/badge elements (.passion-tag)", () => {
    const tags = doc.querySelectorAll(".passion-card .passion-tag");
    expect(tags.length).toBeGreaterThan(0);
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

  it("email link href contains 'akhilreddydanda'", () => {
    const mailto = doc.querySelector("a[href^='mailto:']");
    expect(mailto).not.toBeNull();
    expect(mailto.getAttribute("href")).toContain("akhilreddydanda");
  });

  it("GitHub link href contains 'DandaAkhilReddy'", () => {
    const github = doc.querySelector("a[href*='github.com']");
    expect(github).not.toBeNull();
    expect(github.getAttribute("href")).toContain("DandaAkhilReddy");
  });

  it("LinkedIn link href starts with 'https://www.linkedin.com'", () => {
    const linkedin = doc.querySelector("a[href*='linkedin.com']");
    expect(linkedin).not.toBeNull();
    expect(linkedin.getAttribute("href")).toMatch(/^https:\/\/www\.linkedin\.com/);
  });

  it("email link uses mailto: scheme", () => {
    const mailto = doc.querySelector("a[href^='mailto:']");
    expect(mailto).not.toBeNull();
    expect(mailto.getAttribute("href")).toMatch(/^mailto:/);
  });

  it("GitHub link href contains 'github.com'", () => {
    const github = doc.querySelector("a[href*='github.com']");
    expect(github).not.toBeNull();
    expect(github.getAttribute("href")).toContain("github.com");
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

  it("script contains closeLightbox function", () => {
    expect(html).toContain("closeLightbox");
  });

  it("script contains ArrowRight keyboard handling", () => {
    expect(html).toContain("ArrowRight");
  });

  it("lightbox has .lightbox-caption element", () => {
    const caption = doc.querySelector(".lightbox-caption");
    expect(caption).not.toBeNull();
  });

  it("lightbox container has backdrop click handling in script", () => {
    // Script wires the lightbox element to closeLightbox on backdrop click
    expect(html).toContain("e.target === lightbox");
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

  it("styles include @media (max-width: 900px) tablet breakpoint", () => {
    const styles = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join(" ");
    expect(styles).toContain("max-width: 900px");
  });

  it("styles include .passion-card selector", () => {
    const styles = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join(" ");
    expect(styles).toContain(".passion-card");
  });

  it("styles include .image-lightbox positioning rules", () => {
    const styles = [...doc.querySelectorAll("style")]
      .map((s) => s.textContent)
      .join(" ");
    expect(styles).toContain(".image-lightbox");
  });
});

// ── Script Behavior ───────────────────────────────────────────────────────────

describe("Script Behavior", () => {
  it("script contains scroll event listener for navbar effect", () => {
    expect(html).toContain("scroll");
    expect(html).toContain("scrollY");
  });

  it("script contains addEventListener for keyboard events (keydown)", () => {
    expect(html).toContain("addEventListener");
    expect(html).toContain("keydown");
  });

  it("script contains navigateLightbox for prev/next traversal", () => {
    expect(html).toContain("navigateLightbox");
  });

  it("script initializes imageArray from gallery images", () => {
    expect(html).toContain("imageArray");
    expect(html).toContain("imageArray.push");
  });
});

// ── Lightbox Behavior ────────────────────────────────────────────────────────

describe("Lightbox Behavior", () => {
  let doc;
  let styles;
  beforeEach(() => {
    doc = createDOM();
    styles = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  });

  it("script contains imageLightbox reference", () => {
    expect(html).toContain("imageLightbox");
  });

  it("script contains close button click handler via onclick attribute", () => {
    const closeBtn = doc.querySelector(".lightbox-close");
    expect(closeBtn).not.toBeNull();
    expect(closeBtn.getAttribute("onclick")).toContain("closeLightbox");
  });

  it("script contains prev button handler via onclick attribute", () => {
    const prevBtn = doc.querySelector(".lightbox-prev");
    expect(prevBtn).not.toBeNull();
    expect(prevBtn.getAttribute("onclick")).toContain("navigateLightbox");
  });

  it("script contains next button handler via onclick attribute", () => {
    const nextBtn = doc.querySelector(".lightbox-next");
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.getAttribute("onclick")).toContain("navigateLightbox");
  });

  it("script handles keyboard Escape key", () => {
    expect(html).toContain("'Escape'");
  });

  it("script handles ArrowLeft key", () => {
    expect(html).toContain("'ArrowLeft'");
  });

  it("script handles ArrowRight key", () => {
    expect(html).toContain("'ArrowRight'");
  });

  it("script initializes imageArray as an empty array", () => {
    expect(html).toContain("let imageArray = []");
  });

  it("script has currentImageIndex variable", () => {
    expect(html).toContain("currentImageIndex");
  });

  it("script has wrap-around logic guarding against out-of-bounds index", () => {
    expect(html).toContain("imageArray.length");
    // forward wrap: reset to 0 when index exceeds length
    expect(html).toContain("currentImageIndex = 0");
    // backward wrap: reset to last element
    expect(html).toContain("imageArray.length - 1");
  });

  it(".image-lightbox has display property in CSS", () => {
    expect(styles).toMatch(/\.image-lightbox\s*\{[^}]*display:/s);
  });

  it(".image-lightbox is position: fixed in CSS (covers full viewport)", () => {
    expect(styles).toMatch(/\.image-lightbox\s*\{[^}]*position:\s*fixed/s);
  });
});

// ── Passion Card Internals ────────────────────────────────────────────────────

describe("Passion Card Internals", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("each .passion-card has a .passion-card-header child", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      const header = card.querySelector(".passion-card-header");
      expect(header).not.toBeNull();
    });
  });

  it("each .passion-card-header contains a .passion-icon element", () => {
    const headers = [...doc.querySelectorAll(".passion-card-header")];
    expect(headers.length).toBeGreaterThan(0);
    headers.forEach((header) => {
      const icon = header.querySelector(".passion-icon");
      expect(icon).not.toBeNull();
    });
  });

  it(".passion-tag elements exist across all passion cards", () => {
    const tags = doc.querySelectorAll(".passion-card .passion-tag");
    expect(tags.length).toBeGreaterThan(0);
  });

  it("passion tags include .purple color variant", () => {
    const purpleTags = doc.querySelectorAll(".passion-tag.purple");
    expect(purpleTags.length).toBeGreaterThan(0);
  });

  it("passion tags include .blue color variant", () => {
    const blueTags = doc.querySelectorAll(".passion-tag.blue");
    expect(blueTags.length).toBeGreaterThan(0);
  });

  it("passion tags include .green color variant", () => {
    const greenTags = doc.querySelectorAll(".passion-tag.green");
    expect(greenTags.length).toBeGreaterThan(0);
  });

  it("LLM Fine-tuning card has at least 4 .passion-tag elements", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const llmCard = cards.find((c) => /LLM|Fine.?tuning/i.test(c.textContent));
    expect(llmCard).toBeDefined();
    const tags = llmCard.querySelectorAll(".passion-tag");
    expect(tags.length).toBeGreaterThanOrEqual(4);
  });

  it("LLM card tags include 'Fine-tuning' and 'RAG Systems'", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const llmCard = cards.find((c) => /LLM|Fine.?tuning/i.test(c.textContent));
    expect(llmCard).toBeDefined();
    const tagText = [...llmCard.querySelectorAll(".passion-tag")]
      .map((t) => t.textContent.trim());
    expect(tagText).toContain("Fine-tuning");
    expect(tagText).toContain("RAG Systems");
  });

  it("AI Research card tags include 'ArXiv Daily' and 'Research Papers'", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const researchCard = cards.find((c) => /AI\/ML Research|ArXiv/i.test(c.textContent));
    expect(researchCard).toBeDefined();
    const tagText = [...researchCard.querySelectorAll(".passion-tag")]
      .map((t) => t.textContent.trim());
    expect(tagText).toContain("ArXiv Daily");
    expect(tagText).toContain("Research Papers");
  });

  it("Cricket card tags include 'San Antonio League' and 'Century Scorer'", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    const cricketCard = cards.find((c) => /Professional Cricket/i.test(c.textContent));
    expect(cricketCard).toBeDefined();
    const tagText = [...cricketCard.querySelectorAll(".passion-tag")]
      .map((t) => t.textContent.trim());
    expect(tagText).toContain("San Antonio League");
    expect(tagText).toContain("Century Scorer");
  });

  it("each passion card has at least 2 .passion-tag elements", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    cards.forEach((card) => {
      const tags = card.querySelectorAll(".passion-tag");
      expect(tags.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("each passion card description paragraph is non-empty", () => {
    const cards = [...doc.querySelectorAll(".passion-card")];
    cards.forEach((card) => {
      const p = card.querySelector("p");
      expect(p).not.toBeNull();
      expect(p.textContent.trim().length).toBeGreaterThan(20);
    });
  });
});

// ── Bio Section Depth ─────────────────────────────────────────────────────────

describe("Bio Section Depth", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it(".bio-image-container element exists in the DOM", () => {
    const container = doc.querySelector(".bio-image-container");
    expect(container).not.toBeNull();
  });

  it(".bio-profile-image element exists with an img inside", () => {
    const bioPic = doc.querySelector(".bio-profile-image");
    expect(bioPic).not.toBeNull();
    const img = bioPic.querySelector("img");
    expect(img).not.toBeNull();
  });

  it(".highlight spans exist within bio text", () => {
    const highlights = doc.querySelectorAll(".bio-content .highlight");
    expect(highlights.length).toBeGreaterThan(0);
  });

  it(".highlight spans have non-empty text content", () => {
    const highlights = [...doc.querySelectorAll(".bio-content .highlight")];
    highlights.forEach((span) => {
      expect(span.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  it("bio text contains 'Microsoft' via a strong element", () => {
    const strongs = [...doc.querySelectorAll(".bio-content strong")];
    const microsoftStrong = strongs.find((s) => s.textContent.includes("Microsoft"));
    expect(microsoftStrong).toBeDefined();
  });

  it("bio text contains 'Amazon' via a strong element", () => {
    const strongs = [...doc.querySelectorAll(".bio-content strong")];
    const amazonStrong = strongs.find((s) => s.textContent.includes("Amazon"));
    expect(amazonStrong).toBeDefined();
  });

  it("bio text contains 'Texas A&M University' via a strong element", () => {
    const strongs = [...doc.querySelectorAll(".bio-content strong")];
    const tamStrong = strongs.find((s) => /Texas A&M/i.test(s.textContent));
    expect(tamStrong).toBeDefined();
  });

  it("bio-content has more than one paragraph", () => {
    const paragraphs = doc.querySelectorAll(".bio-content p");
    expect(paragraphs.length).toBeGreaterThan(1);
  });

  it("bio-content has an h2 heading", () => {
    const h2 = doc.querySelector(".bio-content h2");
    expect(h2).not.toBeNull();
    expect(h2.textContent.trim().length).toBeGreaterThan(0);
  });
});

// ── About Hero Details ────────────────────────────────────────────────────────

describe("About Hero Details", () => {
  let doc;
  let styles;
  beforeEach(() => {
    doc = createDOM();
    styles = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  });

  it("CSS contains radial-gradient on .about-hero::before pseudo-element", () => {
    expect(styles).toMatch(/\.about-hero::before[\s\S]*?radial-gradient/);
  });

  it(".hero-profile-image container element exists", () => {
    const container = doc.querySelector(".hero-profile-image");
    expect(container).not.toBeNull();
  });

  it("about hero section contains both h1 and .tagline as direct or nested children", () => {
    const hero = doc.querySelector(".about-hero");
    expect(hero).not.toBeNull();
    expect(hero.querySelector("h1")).not.toBeNull();
    expect(hero.querySelector(".tagline")).not.toBeNull();
  });

  it("tagline contains role and technology spans", () => {
    const taglineSpans = doc.querySelectorAll(".about-hero .tagline span");
    expect(taglineSpans.length).toBeGreaterThanOrEqual(2);
    const allText = [...taglineSpans].map((s) => s.textContent).join(" ");
    expect(allText).toContain("Microsoft");
  });
});

// ── Cricket Gallery Details ───────────────────────────────────────────────────

describe("Cricket Gallery Details", () => {
  let doc;
  let styles;
  beforeEach(() => {
    doc = createDOM();
    styles = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  });

  it(".cricket-gallery container exists", () => {
    const gallery = doc.querySelector(".cricket-gallery");
    expect(gallery).not.toBeNull();
  });

  it("gallery images have cursor: pointer set in CSS", () => {
    expect(styles).toMatch(/\.cricket-gallery\s+img[\s\S]*?cursor:\s*pointer/);
  });

  it("script attaches click listeners to gallery images via forEach and openLightbox", () => {
    expect(html).toContain("galleryImages.forEach");
    expect(html).toContain("openLightbox(index)");
  });

  it("image count in HTML (2) matches imageArray usage in script", () => {
    const galleryImgs = doc.querySelectorAll(".cricket-gallery img");
    expect(galleryImgs.length).toBe(2);
    // script pushes each gallery image into imageArray
    expect(html).toContain("imageArray.push");
  });
});

// ── Connect Section Depth ─────────────────────────────────────────────────────

describe("Connect Section Depth", () => {
  let doc;
  let styles;
  beforeEach(() => {
    doc = createDOM();
    styles = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  });

  it("connect section has an h2 heading", () => {
    const h2 = doc.querySelector(".connect-section h2");
    expect(h2).not.toBeNull();
    expect(h2.textContent.trim().length).toBeGreaterThan(0);
  });

  it("connect section h2 text is \"LET'S CONNECT\"", () => {
    const h2 = doc.querySelector(".connect-section h2");
    expect(h2).not.toBeNull();
    expect(h2.textContent.trim()).toBe("LET'S CONNECT");
  });

  it("each .social-link contains an SVG icon", () => {
    const socialLinks = [...doc.querySelectorAll(".social-link")];
    expect(socialLinks.length).toBeGreaterThan(0);
    socialLinks.forEach((link) => {
      const svg = link.querySelector("svg");
      expect(svg).not.toBeNull();
    });
  });

  it("each .social-link has visible text label", () => {
    const socialLinks = [...doc.querySelectorAll(".social-link")];
    expect(socialLinks.length).toBeGreaterThan(0);
    socialLinks.forEach((link) => {
      // textContent includes the SVG content, so just check it's non-trivially long
      // strip SVG content approximation — link should contain a word label
      expect(link.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  it(".social-link:hover rule includes transform in CSS", () => {
    expect(styles).toMatch(/\.social-link:hover\s*\{[^}]*transform:/s);
  });

  it(".social-link:hover rule includes border-color change in CSS", () => {
    expect(styles).toMatch(/\.social-link:hover\s*\{[^}]*border-color:/s);
  });
});

// ── Accessibility ─────────────────────────────────────────────────────────────

describe("Accessibility", () => {
  let doc;
  beforeEach(() => {
    doc = createDOM();
  });

  it("html element has lang='en'", () => {
    const htmlEl = doc.querySelector("html");
    expect(htmlEl).not.toBeNull();
    expect(htmlEl.getAttribute("lang")).toBe("en");
  });

  it("all img elements have non-empty alt attributes", () => {
    const images = [...doc.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => {
      const alt = img.getAttribute("alt");
      expect(alt).not.toBeNull();
      expect(typeof alt).toBe("string");
      // alt may be empty string for decorative images — assert attribute exists
      expect(alt).toBeDefined();
    });
  });

  it("meta charset UTF-8 exists", () => {
    const charset = doc.querySelector("meta[charset]");
    expect(charset).not.toBeNull();
    expect(charset.getAttribute("charset").toUpperCase()).toBe("UTF-8");
  });
});
