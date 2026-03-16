/**
 * Tests for browse.html — Main portfolio page with hero, projects,
 * skills, experience, certifications, and contact sections.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

const htmlPath = resolve(__dirname, "../browse.html");
const html = readFileSync(htmlPath, "utf-8");

function createDOM() {
  return new JSDOM(html).window.document;
}

describe("browse.html — Main Portfolio Page", () => {
  let doc;

  beforeEach(() => {
    doc = createDOM();
  });

  // ── Navigation ─────────────────────────────────────────────

  describe("navigation", () => {
    it("has nav logo linking to index.html", () => {
      const logo = doc.querySelector(".nav-logo");
      expect(logo).not.toBeNull();
      expect(logo.getAttribute("href")).toBe("index.html");
      expect(logo.textContent).toBe("AKHIL REDDY DANDA");
    });

    it("has all expected nav links", () => {
      const expectedHrefs = [
        "#home",
        "#experience",
        "#skills",
        "#daily-shipping",
        "#certifications",
        "about.html",
        "#contact",
      ];

      const navLinks = doc.querySelectorAll("nav li a, .nav-links li a");
      const hrefs = [...navLinks].map((a) => a.getAttribute("href"));
      expectedHrefs.forEach((expected) => {
        expect(hrefs).toContain(expected);
      });
    });

    it("has profile icon linking to index.html", () => {
      const profileIcon = doc.getElementById("current-profile");
      expect(profileIcon).not.toBeNull();
      expect(profileIcon.getAttribute("href")).toBe("index.html");
    });
  });

  // ── Hero Section ───────────────────────────────────────────

  describe("hero section", () => {
    it("has hero buttons container", () => {
      expect(doc.querySelector(".hero-buttons")).not.toBeNull();
    });

    it("resume button has download attribute with correct filename", () => {
      const resumeBtn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(resumeBtn).not.toBeNull();
      expect(resumeBtn.hasAttribute("download")).toBe(true);
      expect(resumeBtn.getAttribute("download")).toBe(
        "Akhil_Reddy_Danda_Resume.pdf"
      );
    });

    it("resume button has correct href", () => {
      const resumeBtn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(resumeBtn.getAttribute("href")).toBe("assets/resume.pdf");
    });

    it('resume button text contains "Resume"', () => {
      const resumeBtn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(resumeBtn.textContent).toContain("Resume");
    });

    it("resume button has btn-play class", () => {
      const resumeBtn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(resumeBtn.classList.contains("btn-play")).toBe(true);
    });

    it("LinkedIn button links to correct profile", () => {
      const linkedinBtn = doc.querySelector(
        '.hero-buttons a[href*="linkedin.com"]'
      );
      expect(linkedinBtn).not.toBeNull();
      expect(linkedinBtn.getAttribute("target")).toBe("_blank");
    });

    it("LinkedIn button has btn-info class", () => {
      const linkedinBtn = doc.querySelector(
        '.hero-buttons a[href*="linkedin.com"]'
      );
      expect(linkedinBtn.classList.contains("btn-info")).toBe(true);
    });
  });

  // ── Resume PDF File ────────────────────────────────────────

  describe("resume file", () => {
    it("resume PDF exists in assets directory", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      expect(existsSync(resumePath)).toBe(true);
    });

    it("resume file is a valid PDF", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      const buffer = readFileSync(resumePath);
      const header = buffer.slice(0, 5).toString("ascii");
      expect(header).toBe("%PDF-");
    });

    it("resume file is non-trivial size (>10KB)", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      const stats = require("fs").statSync(resumePath);
      expect(stats.size).toBeGreaterThan(10000);
    });
  });

  // ── Beyond the Code (Passion Cards) ────────────────────────

  describe("beyond the code section", () => {
    it("has section title", () => {
      const titles = [...doc.querySelectorAll("h2")];
      const beyondTitle = titles.find((t) =>
        t.textContent.includes("Beyond the Code")
      );
      expect(beyondTitle).toBeTruthy();
    });

    it("cards are in correct order: Backend, LLM, Cricket", () => {
      const h3s = [...doc.querySelectorAll("h3")];
      const passionTitles = h3s
        .map((h) => h.textContent.trim())
        .filter(
          (t) =>
            t === "Backend Engineering & Architecture" ||
            t === "LLM Builder & Researcher" ||
            t === "Cricket Enthusiast"
        );
      expect(passionTitles).toEqual([
        "Backend Engineering & Architecture",
        "LLM Builder & Researcher",
        "Cricket Enthusiast",
      ]);
    });

    it("Backend card has correct tags", () => {
      const allText = doc.body.innerHTML;
      expect(allText).toContain("Microservices");
      expect(allText).toContain("API Design");
      expect(allText).toContain("System Design");
      expect(allText).toContain("Scalable Architecture");
    });

    it("LLM card has correct tags", () => {
      const allText = doc.body.innerHTML;
      expect(allText).toContain("Fine-tuning");
      expect(allText).toContain("RAG Systems");
      expect(allText).toContain("Prompt Engineering");
      expect(allText).toContain("Model Testing");
    });

    it("Cricket card has image gallery", () => {
      const gallery = doc.getElementById("cricket-gallery");
      expect(gallery).not.toBeNull();
      const images = gallery.querySelectorAll("img");
      expect(images.length).toBe(2);
    });

    it("Cricket images have alt text", () => {
      const gallery = doc.getElementById("cricket-gallery");
      gallery.querySelectorAll("img").forEach((img) => {
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });
  });

  // ── Today's Top Picks (Netflix Cards) ──────────────────────

  describe("top picks section", () => {
    it("has profile name span for dynamic title", () => {
      const span = doc.getElementById("profile-name");
      expect(span).not.toBeNull();
    });

    it("has netflix cards for Skills, Experience, Certifications", () => {
      const cardTitles = [...doc.querySelectorAll(".netflix-card-title")].map(
        (el) => el.textContent
      );
      expect(cardTitles).toContain("Skills");
      expect(cardTitles).toContain("Experience");
      expect(cardTitles).toContain("Certifications");
    });

    it("Skills card has onclick to scroll to #skills", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const skillsCard = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('skills')")
      );
      expect(skillsCard).toBeTruthy();
    });

    it("Experience card has onclick to scroll to #experience", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('experience')")
      );
      expect(card).toBeTruthy();
    });

    it("Certifications card has onclick to scroll to #certifications", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('certifications')")
      );
      expect(card).toBeTruthy();
    });

    it("LinkedIn card opens LinkedIn in new tab", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("linkedin.com")
      );
      expect(card).toBeTruthy();
      expect(card.getAttribute("onclick")).toContain("_blank");
    });

    it("GitHub card opens GitHub in new tab", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("github.com")
      );
      expect(card).toBeTruthy();
      expect(card.getAttribute("onclick")).toContain("_blank");
    });
  });

  // ── Project Cards (Daily Shipping) ─────────────────────────

  describe("project cards", () => {
    it("has daily shipping section", () => {
      expect(doc.getElementById("daily-shipping")).not.toBeNull();
    });

    it("has at least 5 daily cards", () => {
      const cards = doc.querySelectorAll(".daily-card");
      expect(cards.length).toBeGreaterThanOrEqual(5);
    });

    it("each daily card has onclick navigation", () => {
      doc.querySelectorAll(".daily-card").forEach((card) => {
        expect(card.getAttribute("onclick")).toBeTruthy();
      });
    });

    it("project cards have GitHub links", () => {
      const githubLinks = doc.querySelectorAll(".card-link.github");
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);
      githubLinks.forEach((link) => {
        expect(link.getAttribute("href")).toContain("github.com");
        expect(link.getAttribute("target")).toBe("_blank");
      });
    });

    it("featured daily cards have the featured class", () => {
      const featured = doc.querySelectorAll(".daily-card.featured");
      expect(featured.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Academic Projects ──────────────────────────────────────

  describe("academic projects", () => {
    it("has ADAS project card", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const adasCard = cards.find((c) =>
        c.getAttribute("onclick")?.includes("adas-system")
      );
      expect(adasCard).toBeTruthy();
    });

    it("has financial sentiment project card", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("financial-sentiment")
      );
      expect(card).toBeTruthy();
    });

    it("has healthcare RAG project card", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("healthcare-rag")
      );
      expect(card).toBeTruthy();
    });
  });

  // ── Skills Section ─────────────────────────────────────────

  describe("skills section", () => {
    it("has skills section with correct id", () => {
      expect(doc.getElementById("skills")).not.toBeNull();
    });

    it("contains distributed systems tags", () => {
      const tags = doc.querySelectorAll(".ds-tag");
      expect(tags.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Experience Section ─────────────────────────────────────

  describe("experience section", () => {
    it("has experience section with correct id", () => {
      expect(doc.getElementById("experience")).not.toBeNull();
    });

    it("has Microsoft experience card", () => {
      const msCard = doc.querySelector(".experience-card.microsoft");
      expect(msCard).not.toBeNull();
    });
  });

  // ── Certifications Section ─────────────────────────────────

  describe("certifications section", () => {
    it("has certifications section with correct id", () => {
      expect(doc.getElementById("certifications")).not.toBeNull();
    });

    it("has at least 5 cert cards", () => {
      const certLinks = doc.querySelectorAll(".cert-card");
      expect(certLinks.length).toBeGreaterThanOrEqual(5);
    });

    it("cert card links open in new tab", () => {
      const certLinks = doc.querySelectorAll("a.cert-card");
      expect(certLinks.length).toBeGreaterThanOrEqual(5);
      certLinks.forEach((link) => {
        expect(link.getAttribute("target")).toBe("_blank");
      });
    });

    it("cert card links have valid external hrefs", () => {
      const certLinks = doc.querySelectorAll("a.cert-card");
      certLinks.forEach((link) => {
        const href = link.getAttribute("href");
        expect(href).toBeTruthy();
        expect(href.startsWith("https://")).toBe(true);
      });
    });
  });

  // ── Contact Section ────────────────────────────────────────

  describe("contact section", () => {
    it("has contact section with correct id", () => {
      expect(doc.getElementById("contact")).not.toBeNull();
    });

    it("has email contact link", () => {
      const emailLink = doc.querySelector('a[href^="mailto:"]');
      expect(emailLink).not.toBeNull();
      expect(emailLink.getAttribute("href")).toContain("akhilreddydanda");
    });

    it("has LinkedIn contact link", () => {
      const links = [...doc.querySelectorAll(".contact-link")];
      const linkedin = links.find((l) =>
        l.getAttribute("href")?.includes("linkedin.com")
      );
      expect(linkedin).toBeTruthy();
    });

    it("has GitHub contact link", () => {
      const links = [...doc.querySelectorAll(".contact-link")];
      const github = links.find((l) =>
        l.getAttribute("href")?.includes("github.com")
      );
      expect(github).toBeTruthy();
    });
  });

  // ── Profile Config Script ──────────────────────────────────

  describe("profile configuration script", () => {
    let scriptContent;

    beforeEach(() => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("profileConfig")
      );
      scriptContent = mainScript?.textContent || "";
    });

    it("has profileConfig with recruiter profile", () => {
      expect(scriptContent).toContain("recruiter:");
    });

    it("has profileConfig with developer profile", () => {
      expect(scriptContent).toContain("developer:");
    });

    it("has profileConfig with visitor profile", () => {
      expect(scriptContent).toContain("visitor:");
    });

    it("has profileConfig with adventurer profile", () => {
      expect(scriptContent).toContain("adventurer:");
    });

    it("default profile fallback is recruiter", () => {
      expect(scriptContent).toContain("|| 'recruiter'");
    });

    it("fallback config uses profileConfig.recruiter", () => {
      expect(scriptContent).toContain("profileConfig.recruiter");
    });

    it("profiles have localVideo paths", () => {
      expect(scriptContent).toContain("localVideo:");
    });

    it("profiles have fallbackVideo URLs", () => {
      expect(scriptContent).toContain("fallbackVideo:");
    });
  });

  // ── Background Video ───────────────────────────────────────

  describe("background video", () => {
    it("has video container", () => {
      expect(doc.querySelector(".bg-video-container")).not.toBeNull();
    });

    it("has video element inside container", () => {
      expect(
        doc.querySelector(".bg-video-container video")
      ).not.toBeNull();
    });

    it("has dark overlay for readability", () => {
      expect(doc.querySelector(".bg-video-overlay")).not.toBeNull();
    });
  });

  // ── Smooth Scroll Script ───────────────────────────────────

  describe("smooth scroll behavior", () => {
    it("script registers scroll listener for navbar", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const scrollScript = scripts.find((s) =>
        s.textContent.includes("scrollIntoView")
      );
      expect(scrollScript).toBeTruthy();
    });
  });
});
