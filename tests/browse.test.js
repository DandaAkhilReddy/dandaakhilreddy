/**
 * Tests for browse.html — Main portfolio page with hero, projects,
 * skills, experience, certifications, and contact sections.
 */
import { readFileSync, existsSync, statSync } from "fs";
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

  // ── Navigation ─────────────────────────────────────────────────────────────

  describe("navigation", () => {
    it("nav logo links to index.html with correct text", () => {
      const logo = doc.querySelector(".nav-logo");
      expect(logo).not.toBeNull();
      expect(logo.getAttribute("href")).toBe("index.html");
      expect(logo.textContent.trim()).toBe("AKHIL REDDY DANDA");
    });

    it("has all 7 expected nav links", () => {
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

    it("#current-profile links to index.html", () => {
      const profileIcon = doc.getElementById("current-profile");
      expect(profileIcon).not.toBeNull();
      expect(profileIcon.getAttribute("href")).toBe("index.html");
    });

    it("#nav-profile-img element exists", () => {
      expect(doc.getElementById("nav-profile-img")).not.toBeNull();
    });
  });

  // ── Hero Section ───────────────────────────────────────────────────────────

  describe("hero section", () => {
    it(".hero-buttons container exists", () => {
      expect(doc.querySelector(".hero-buttons")).not.toBeNull();
    });

    it("resume button has download attribute with correct filename", () => {
      const btn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(btn).not.toBeNull();
      expect(btn.getAttribute("download")).toBe("Akhil_Reddy_Danda_Resume.pdf");
    });

    it('resume button text contains "Resume"', () => {
      const btn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(btn.textContent).toContain("Resume");
    });

    it("resume button has btn-play class", () => {
      const btn = doc.querySelector('a[href="assets/resume.pdf"]');
      expect(btn.classList.contains("btn-play")).toBe(true);
    });

    it("LinkedIn button exists inside .hero-buttons with target _blank", () => {
      const btn = doc.querySelector('.hero-buttons a[href*="linkedin.com"]');
      expect(btn).not.toBeNull();
      expect(btn.getAttribute("target")).toBe("_blank");
    });

    it("LinkedIn button has btn-info class", () => {
      const btn = doc.querySelector('.hero-buttons a[href*="linkedin.com"]');
      expect(btn.classList.contains("btn-info")).toBe(true);
    });
  });

  // ── Resume PDF File ────────────────────────────────────────────────────────

  describe("resume file", () => {
    it("assets/resume.pdf exists on disk", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      expect(existsSync(resumePath)).toBe(true);
    });

    it("resume file starts with valid PDF header (%PDF-)", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      const buffer = readFileSync(resumePath);
      expect(buffer.slice(0, 5).toString("ascii")).toBe("%PDF-");
    });

    it("resume file size is greater than 10KB", () => {
      const resumePath = resolve(__dirname, "../assets/resume.pdf");
      expect(statSync(resumePath).size).toBeGreaterThan(10000);
    });
  });

  // ── Beyond the Code ────────────────────────────────────────────────────────

  describe("beyond the code section", () => {
    it('h2 contains "Beyond the Code"', () => {
      const h2s = [...doc.querySelectorAll("h2")];
      const match = h2s.find((el) => el.textContent.includes("Beyond the Code"));
      expect(match).toBeTruthy();
    });

    it("passion cards are in order: Backend, LLM, Cricket", () => {
      const h3s = [...doc.querySelectorAll("h3")];
      const titles = h3s
        .map((h) => h.textContent.trim())
        .filter(
          (t) =>
            t === "Backend Engineering & Architecture" ||
            t === "LLM Builder & Researcher" ||
            t === "Cricket Enthusiast"
        );
      expect(titles).toEqual([
        "Backend Engineering & Architecture",
        "LLM Builder & Researcher",
        "Cricket Enthusiast",
      ]);
    });

    it("Backend card has correct tags", () => {
      const body = doc.body.innerHTML;
      expect(body).toContain("Microservices");
      expect(body).toContain("API Design");
      expect(body).toContain("System Design");
      expect(body).toContain("Scalable Architecture");
    });

    it("LLM card has correct tags", () => {
      const body = doc.body.innerHTML;
      expect(body).toContain("Fine-tuning");
      expect(body).toContain("RAG Systems");
      expect(body).toContain("Prompt Engineering");
      expect(body).toContain("Model Testing");
    });

    it("#cricket-gallery has exactly 2 images", () => {
      const gallery = doc.getElementById("cricket-gallery");
      expect(gallery).not.toBeNull();
      expect(gallery.querySelectorAll("img").length).toBe(2);
    });

    it("cricket images have alt text", () => {
      const gallery = doc.getElementById("cricket-gallery");
      gallery.querySelectorAll("img").forEach((img) => {
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });
  });

  // ── Netflix Quick-Nav Cards ────────────────────────────────────────────────

  describe("netflix quick-nav cards", () => {
    it("#profile-name span exists", () => {
      expect(doc.getElementById("profile-name")).not.toBeNull();
    });

    it(".netflix-card-title contains Skills, Experience, Certifications", () => {
      const titles = [...doc.querySelectorAll(".netflix-card-title")].map(
        (el) => el.textContent.trim()
      );
      expect(titles).toContain("Skills");
      expect(titles).toContain("Experience");
      expect(titles).toContain("Certifications");
    });

    it("Skills card onclick includes getElementById('skills')", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('skills')")
      );
      expect(card).toBeTruthy();
    });

    it("Experience card onclick includes getElementById('experience')", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('experience')")
      );
      expect(card).toBeTruthy();
    });

    it("Certifications card onclick includes getElementById('certifications')", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("getElementById('certifications')")
      );
      expect(card).toBeTruthy();
    });

    it("LinkedIn card onclick includes linkedin.com and _blank", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("linkedin.com")
      );
      expect(card).toBeTruthy();
      expect(card.getAttribute("onclick")).toContain("_blank");
    });

    it("GitHub card onclick includes github.com and _blank", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("github.com")
      );
      expect(card).toBeTruthy();
      expect(card.getAttribute("onclick")).toContain("_blank");
    });
  });

  // ── Academic Projects ──────────────────────────────────────────────────────

  describe("academic projects", () => {
    it("has card with onclick containing adas-system", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("adas-system")
      );
      expect(card).toBeTruthy();
    });

    it("has card with onclick containing financial-sentiment", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("financial-sentiment")
      );
      expect(card).toBeTruthy();
    });

    it("has card with onclick containing healthcare-rag", () => {
      const cards = [...doc.querySelectorAll(".netflix-card")];
      const card = cards.find((c) =>
        c.getAttribute("onclick")?.includes("healthcare-rag")
      );
      expect(card).toBeTruthy();
    });
  });

  // ── Daily Shipping Section ─────────────────────────────────────────────────

  describe("daily shipping section", () => {
    it("#daily-shipping section exists", () => {
      expect(doc.getElementById("daily-shipping")).not.toBeNull();
    });

    it("has at least 5 .daily-card elements", () => {
      expect(doc.querySelectorAll(".daily-card").length).toBeGreaterThanOrEqual(5);
    });

    it("each daily card has an onclick attribute", () => {
      doc.querySelectorAll(".daily-card").forEach((card) => {
        expect(card.getAttribute("onclick")).toBeTruthy();
      });
    });

    it(".card-link.github links contain github.com with target _blank", () => {
      const githubLinks = doc.querySelectorAll(".card-link.github");
      expect(githubLinks.length).toBeGreaterThanOrEqual(1);
      githubLinks.forEach((link) => {
        expect(link.getAttribute("href")).toContain("github.com");
        expect(link.getAttribute("target")).toBe("_blank");
      });
    });

    it("at least one .daily-card.featured exists", () => {
      expect(doc.querySelectorAll(".daily-card.featured").length).toBeGreaterThanOrEqual(1);
    });

    it("all 8 daily project pages referenced in onclick attributes", () => {
      const onclicks = [...doc.querySelectorAll(".daily-card")]
        .map((c) => c.getAttribute("onclick") || "")
        .join(" ");
      expect(onclicks).toContain("day-1-llm-ios");
      expect(onclicks).toContain("day-2-claude-peepee");
      expect(onclicks).toContain("day-3-speakskiptype");
      expect(onclicks).toContain("day-4-audtext");
      expect(onclicks).toContain("day-minus-5-wifivision");
      expect(onclicks).toContain("day-6-localbrowsercontrol");
      expect(onclicks).toContain("day-7-reddyhedgefund");
      expect(onclicks).toContain("day-8-stock-analyzer");
    });

    it("LinkedIn post links exist on daily cards", () => {
      const linkedinLinks = doc.querySelectorAll(
        'a[href*="linkedin.com/posts"]'
      );
      expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("YouTube demo link is present", () => {
      const youtubeLink = doc.querySelector('a[href*="youtu"]');
      expect(youtubeLink).not.toBeNull();
    });
  });

  // ── Experience Section ─────────────────────────────────────────────────────

  describe("experience section", () => {
    it("#experience section exists", () => {
      expect(doc.getElementById("experience")).not.toBeNull();
    });

    it(".experience-card.microsoft exists", () => {
      expect(doc.querySelector(".experience-card.microsoft")).not.toBeNull();
    });

    it("HHA Medicine card exists", () => {
      const cards = [...doc.querySelectorAll(".experience-card")];
      const hha = cards.find((c) => c.innerHTML.includes("HHA Medicine"));
      expect(hha).toBeTruthy();
    });

    it(".experience-card.amazon exists", () => {
      expect(doc.querySelector(".experience-card.amazon")).not.toBeNull();
    });

    it("cards have role text containing SDE or Software", () => {
      const cards = [...doc.querySelectorAll(".experience-card")];
      const hasRoleText = cards.some(
        (c) => c.innerHTML.includes("SDE") || c.innerHTML.includes("Software")
      );
      expect(hasRoleText).toBe(true);
    });

    it("experience cards have tech stack tags", () => {
      const techTags = doc.querySelectorAll(".exp-tech span");
      expect(techTags.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Microsoft Prep Section ─────────────────────────────────────────────────

  describe("microsoft prep section", () => {
    it("#microsoft-prep section exists", () => {
      expect(doc.getElementById("microsoft-prep")).not.toBeNull();
    });

    it("has exactly 6 prep topic cards", () => {
      const section = doc.getElementById("microsoft-prep");
      expect(section.querySelectorAll(".msft-prep-card").length).toBe(6);
    });

    it("prep topics include C#, Distributed Systems, Azure, System Design, Databases, Operating Systems", () => {
      const section = doc.getElementById("microsoft-prep");
      const body = section.innerHTML;
      expect(body).toContain("C#");
      expect(body).toContain("Distributed Systems");
      expect(body).toContain("Azure");
      expect(body).toContain("System Design");
      expect(body).toContain("Databases");
      expect(body).toContain("Operating Systems");
    });
  });

  // ── Skills Section ─────────────────────────────────────────────────────────

  describe("skills section", () => {
    it("#skills section exists", () => {
      expect(doc.getElementById("skills")).not.toBeNull();
    });

    it(".featured-skills banner has at least 5 items", () => {
      const featuredItems = doc.querySelectorAll(".featured-skill");
      expect(featuredItems.length).toBeGreaterThanOrEqual(5);
    });

    it("Languages section has 6 skill items", () => {
      const section = doc.getElementById("skills");
      // The skills-grid-new immediately after "Languages & Frameworks" heading
      const grids = [...section.querySelectorAll(".skills-grid-new")];
      // First grid is Languages & Frameworks
      const langGrid = grids[0];
      expect(langGrid.querySelectorAll(".skill-card-new").length).toBe(6);
    });

    it(".ds-tag elements count is >= 10", () => {
      expect(doc.querySelectorAll(".ds-tag").length).toBeGreaterThanOrEqual(10);
    });

    it("Cloud & DevOps items have azure, aws, k8s, docker progress classes", () => {
      const progressBars = [...doc.querySelectorAll(".skill-progress")];
      const classes = progressBars.flatMap((el) => [...el.classList]);
      expect(classes).toContain("azure");
      expect(classes).toContain("aws");
      expect(classes).toContain("k8s");
      expect(classes).toContain("docker");
    });

    it("ML & AI skill cards have glow class", () => {
      const glowCards = doc.querySelectorAll(".skill-card-new.glow");
      expect(glowCards.length).toBeGreaterThanOrEqual(1);
    });

    it("skill bars exist with width percentages in inline style", () => {
      const bars = [...doc.querySelectorAll(".skill-progress")];
      const hasWidthStyle = bars.some((el) =>
        (el.getAttribute("style") || "").includes("width:")
      );
      expect(hasWidthStyle).toBe(true);
    });

    it("devicon CDN images are present", () => {
      const deviconImgs = doc.querySelectorAll('img[src*="devicon"]');
      expect(deviconImgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Education Section ──────────────────────────────────────────────────────

  describe("education section", () => {
    it("#education section exists", () => {
      expect(doc.getElementById("education")).not.toBeNull();
    });

    it('contains "Texas A&M" and "Dec 2021"', () => {
      const section = doc.getElementById("education");
      expect(section.innerHTML).toContain("Texas A&amp;M");
      expect(section.innerHTML).toContain("Dec 2021");
    });

    it('contains "SRM Institute" and "May 2019"', () => {
      const section = doc.getElementById("education");
      expect(section.innerHTML).toContain("SRM Institute");
      expect(section.innerHTML).toContain("May 2019");
    });
  });

  // ── Certifications Section ─────────────────────────────────────────────────

  describe("certifications section", () => {
    it("#certifications section exists", () => {
      expect(doc.getElementById("certifications")).not.toBeNull();
    });

    it("has at least 25 .cert-card elements", () => {
      expect(doc.querySelectorAll(".cert-card").length).toBeGreaterThanOrEqual(25);
    });

    it("HackerRank certs: at least 2 a.cert-card with hackerrank.com href", () => {
      const hrCerts = doc.querySelectorAll('a.cert-card[href*="hackerrank.com"]');
      expect(hrCerts.length).toBeGreaterThanOrEqual(2);
    });

    it("Databricks cert content is present in certifications section", () => {
      const section = doc.getElementById("certifications");
      expect(section.innerHTML).toContain("Databricks");
    });

    it("DeepLearning.AI certs: at least 10 a.cert-card with deeplearning.ai href", () => {
      const dlCerts = doc.querySelectorAll('a.cert-card[href*="deeplearning.ai"]');
      expect(dlCerts.length).toBeGreaterThanOrEqual(10);
    });

    it("all a.cert-card elements have target _blank", () => {
      const certLinks = doc.querySelectorAll("a.cert-card");
      expect(certLinks.length).toBeGreaterThanOrEqual(1);
      certLinks.forEach((link) => {
        expect(link.getAttribute("target")).toBe("_blank");
      });
    });

    it("all a.cert-card hrefs start with https://", () => {
      const certLinks = doc.querySelectorAll("a.cert-card");
      certLinks.forEach((link) => {
        expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      });
    });

    it("Claude Code cert has special border color (#e50914)", () => {
      const certLinks = doc.querySelectorAll("a.cert-card");
      const claudeCert = [...certLinks].find((link) =>
        link.innerHTML.includes("Claude Code")
      );
      expect(claudeCert).toBeTruthy();
      const style = claudeCert.getAttribute("style") || "";
      expect(style).toContain("e50914");
    });
  });

  // ── Contact Section ────────────────────────────────────────────────────────

  describe("contact section", () => {
    it("#contact section exists", () => {
      expect(doc.getElementById("contact")).not.toBeNull();
    });

    it('a[href^="mailto:"] contains "akhilreddydanda"', () => {
      const emailLink = doc.querySelector('a[href^="mailto:"]');
      expect(emailLink).not.toBeNull();
      expect(emailLink.getAttribute("href")).toContain("akhilreddydanda");
    });

    it(".contact-link with href containing linkedin.com exists", () => {
      const links = [...doc.querySelectorAll(".contact-link")];
      const linkedin = links.find((l) =>
        l.getAttribute("href")?.includes("linkedin.com")
      );
      expect(linkedin).toBeTruthy();
    });

    it(".contact-link with href containing github.com exists", () => {
      const links = [...doc.querySelectorAll(".contact-link")];
      const github = links.find((l) =>
        l.getAttribute("href")?.includes("github.com")
      );
      expect(github).toBeTruthy();
    });
  });

  // ── Profile Config Script ──────────────────────────────────────────────────

  describe("profile configuration script", () => {
    let scriptContent;

    beforeEach(() => {
      const scripts = [...doc.querySelectorAll("script")];
      const mainScript = scripts.find((s) =>
        s.textContent.includes("profileConfig")
      );
      scriptContent = mainScript?.textContent ?? "";
    });

    it("script contains recruiter: key", () => {
      expect(scriptContent).toContain("recruiter:");
    });

    it("script contains developer: key", () => {
      expect(scriptContent).toContain("developer:");
    });

    it("script contains visitor: key", () => {
      expect(scriptContent).toContain("visitor:");
    });

    it("script contains adventurer: key", () => {
      expect(scriptContent).toContain("adventurer:");
    });

    it("script contains default profile fallback || 'recruiter'", () => {
      expect(scriptContent).toContain("|| 'recruiter'");
    });

    it("script contains profileConfig.recruiter fallback reference", () => {
      expect(scriptContent).toContain("profileConfig.recruiter");
    });

    it("script contains localVideo: property", () => {
      expect(scriptContent).toContain("localVideo:");
    });

    it("script contains fallbackVideo: property", () => {
      expect(scriptContent).toContain("fallbackVideo:");
    });

    it("recruiter fallbackVideo is Wolf of Wall Street", () => {
      expect(scriptContent).toContain("wolf-of-wall-street.mp4");
    });

    it("developer fallbackVideo is Hackerman", () => {
      expect(scriptContent).toContain("hackerman.mp4");
    });

    it("visitor fallbackVideo is SpongeBob", () => {
      expect(scriptContent).toContain("spongebob.mp4");
    });

    it("adventurer fallbackVideo is Indiana Jones (giphy)", () => {
      expect(scriptContent).toContain("giphy.mp4");
    });
  });

  // ── Background Video ───────────────────────────────────────────────────────

  describe("background video", () => {
    it(".bg-video-container exists", () => {
      expect(doc.querySelector(".bg-video-container")).not.toBeNull();
    });

    it(".bg-video-container contains a video element", () => {
      expect(doc.querySelector(".bg-video-container video")).not.toBeNull();
    });

    it(".bg-video-overlay exists", () => {
      expect(doc.querySelector(".bg-video-overlay")).not.toBeNull();
    });
  });

  // ── Smooth Scroll ──────────────────────────────────────────────────────────

  describe("smooth scroll behavior", () => {
    it("script contains scrollIntoView for smooth navigation", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const scrollScript = scripts.find((s) =>
        s.textContent.includes("scrollIntoView")
      );
      expect(scrollScript).toBeTruthy();
    });
  });

  // ── Navbar Scroll Effect ───────────────────────────────────────────────────

  describe("navbar scroll effect", () => {
    it("script contains scrollY or scroll event listener", () => {
      const scripts = [...doc.querySelectorAll("script")];
      const scrollScript = scripts.find(
        (s) =>
          s.textContent.includes("scrollY") || s.textContent.includes("scroll")
      );
      expect(scrollScript).toBeTruthy();
    });
  });
});
