/**
 * Integration tests — cross-page consistency, asset integrity, external links,
 * project file existence, and content consistency across the portfolio site.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

const ROOT = resolve(__dirname, "..");

function loadDoc(filename) {
  const filePath = resolve(ROOT, filename);
  const html = readFileSync(filePath, "utf-8");
  return { doc: new JSDOM(html).window.document, html };
}

const { doc: indexDoc, html: indexHtml } = loadDoc("index.html");
const { doc: browseDoc, html: browseHtml } = loadDoc("browse.html");
const { doc: aboutDoc, html: aboutHtml } = loadDoc("about.html");

// ── Page-to-Page Navigation ──────────────────────────────────────────────────

describe("Page-to-Page Navigation", () => {
  it("index.html has 4 profile cards linking to browse.html?profile=<name>", () => {
    const profileCards = [...indexDoc.querySelectorAll("a.profile-card[href]")];
    expect(profileCards.length).toBe(4);
    const expectedProfiles = ["recruiter", "developer", "visitor", "adventurer"];
    expectedProfiles.forEach((profile) => {
      const match = profileCards.find((a) =>
        a.getAttribute("href").includes(`browse.html?profile=${profile}`)
      );
      expect(match).toBeDefined();
    });
  });

  it("browse.html nav logo href points to index.html", () => {
    const logo = browseDoc.querySelector("nav a.nav-logo");
    expect(logo).not.toBeNull();
    expect(logo.getAttribute("href")).toBe("index.html");
  });

  it("browse.html nav has a link to about.html", () => {
    const aboutLink = browseDoc.querySelector("nav a[href='about.html']");
    expect(aboutLink).not.toBeNull();
  });

  it("about.html has a link back to browse.html", () => {
    const backLink = aboutDoc.querySelector(
      "a[href='browse.html'], a[href*='browse.html']"
    );
    expect(backLink).not.toBeNull();
  });

  it("about.html nav links reference browse.html for section anchors", () => {
    const navLinks = [...aboutDoc.querySelectorAll("nav a[href]")];
    const browseRefs = navLinks.filter((a) =>
      a.getAttribute("href").includes("browse.html")
    );
    expect(browseRefs.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Profile System Consistency ───────────────────────────────────────────────

describe("Profile System Consistency", () => {
  it("index.html profile names match profileConfig keys in browse.html", () => {
    const expectedProfiles = ["recruiter", "developer", "visitor", "adventurer"];
    expectedProfiles.forEach((profile) => {
      // profileConfig is declared in a script block in browse.html
      expect(browseHtml).toContain(`${profile}:`);
    });
  });

  it("default profile fallback in browse.html is 'recruiter' (a valid profile key)", () => {
    // The script does: urlParams.get('profile') || 'recruiter'
    // and: profileConfig[profile] || profileConfig.recruiter
    expect(browseHtml).toContain("|| 'recruiter'");
    expect(browseHtml).toContain("profileConfig.recruiter");
  });
});

// ── Asset Integrity ──────────────────────────────────────────────────────────

describe("Asset Integrity", () => {
  it("assets/resume.pdf exists", () => {
    expect(existsSync(resolve(ROOT, "assets/resume.pdf"))).toBe(true);
  });

  it("assets/netflix-sound.mp3 exists", () => {
    expect(existsSync(resolve(ROOT, "assets/netflix-sound.mp3"))).toBe(true);
  });

  it("assets/profile/Profilepicture.jpeg exists", () => {
    expect(
      existsSync(resolve(ROOT, "assets/profile/Profilepicture.jpeg"))
    ).toBe(true);
  });

  it("all 4 who's-watching avatar images exist", () => {
    const avatars = [
      "assets/whos-watching/RECRUITER_iMAGE.png",
      "assets/whos-watching/DEVELOPER_IMGE.png",
      "assets/whos-watching/STALKER_IMAGE.png",
      "assets/whos-watching/ADVENTURER_IMAGE.png",
    ];
    avatars.forEach((path) => {
      expect(existsSync(resolve(ROOT, path))).toBe(true);
    });
  });

  it("both cricket images exist in assets/cricket/", () => {
    const cricketImages = [
      "assets/cricket/Century_sanantonioleague.jpeg",
      "assets/cricket/Cricclubs_163.jpeg",
    ];
    cricketImages.forEach((path) => {
      expect(existsSync(resolve(ROOT, path))).toBe(true);
    });
  });
});

// ── External Link Validation ─────────────────────────────────────────────────

describe("External Link Validation", () => {
  it("all GitHub links in browse.html use https://github.com/DandaAkhilReddy/", () => {
    const githubLinks = [
      ...browseDoc.querySelectorAll("a[href*='github.com']"),
    ].filter((a) => {
      const href = a.getAttribute("href");
      // Exclude any github.com links that are not user-profile links (e.g. platform urls)
      return href.startsWith("https://github.com/");
    });
    expect(githubLinks.length).toBeGreaterThan(0);
    githubLinks.forEach((a) => {
      const href = a.getAttribute("href");
      expect(href).toMatch(/^https:\/\/github\.com\/DandaAkhilReddy/);
    });
  });

  it("all LinkedIn links in browse.html use https://www.linkedin.com/", () => {
    const linkedinLinks = [
      ...browseDoc.querySelectorAll("a[href*='linkedin.com']"),
    ];
    expect(linkedinLinks.length).toBeGreaterThan(0);
    linkedinLinks.forEach((a) => {
      expect(a.getAttribute("href")).toMatch(/^https:\/\/www\.linkedin\.com\//);
    });
  });

  it("all anchor cert-cards in browse.html use https://", () => {
    const certLinks = [
      ...browseDoc.querySelectorAll("a.cert-card[href]"),
    ];
    expect(certLinks.length).toBeGreaterThan(0);
    certLinks.forEach((a) => {
      expect(a.getAttribute("href")).toMatch(/^https:\/\//);
    });
  });

  it("no mailto links have empty addresses", () => {
    const allMailto = [
      ...browseDoc.querySelectorAll("a[href^='mailto:']"),
      ...aboutDoc.querySelectorAll("a[href^='mailto:']"),
    ];
    expect(allMailto.length).toBeGreaterThan(0);
    allMailto.forEach((a) => {
      const href = a.getAttribute("href");
      // mailto: must be followed by a non-empty address
      expect(href.replace("mailto:", "").trim().length).toBeGreaterThan(0);
    });
  });
});

// ── Project Pages Exist ──────────────────────────────────────────────────────

describe("Project Pages Exist", () => {
  const dailyProjects = [
    "projects/day-1-llm-ios.html",
    "projects/day-2-claude-peepee.html",
    "projects/day-3-speakskiptype.html",
    "projects/day-4-audtext.html",
    "projects/day-minus-5-wifivision.html",
    "projects/day-6-localbrowsercontrol.html",
    "projects/day-7-reddyhedgefund.html",
    "projects/day-8-stock-analyzer.html",
  ];

  const academicProjects = [
    "projects/adas-system.html",
    "projects/financial-sentiment.html",
    "projects/healthcare-rag.html",
  ];

  it("all 8 daily project HTML files exist", () => {
    dailyProjects.forEach((file) => {
      expect(existsSync(resolve(ROOT, file))).toBe(true);
    });
  });

  it("all 3 academic project HTML files exist", () => {
    academicProjects.forEach((file) => {
      expect(existsSync(resolve(ROOT, file))).toBe(true);
    });
  });

  it("projects/project-styles.css exists", () => {
    expect(
      existsSync(resolve(ROOT, "projects/project-styles.css"))
    ).toBe(true);
  });
});

// ── Content Consistency ──────────────────────────────────────────────────────

describe("Content Consistency", () => {
  it("brand name 'AKHIL REDDY DANDA' appears in index.html title area", () => {
    const enterBrand = indexDoc.querySelector(".enter-brand");
    expect(enterBrand).not.toBeNull();
    expect(enterBrand.textContent).toMatch(/AKHIL REDDY DANDA/i);
  });

  it("brand name appears in browse.html nav logo", () => {
    const navLogo = browseDoc.querySelector("nav a.nav-logo");
    expect(navLogo).not.toBeNull();
    expect(navLogo.textContent).toMatch(/AKHIL REDDY DANDA/i);
  });

  it("contact email contains 'akhilreddydanda' in both browse.html and about.html", () => {
    const browseMailto = browseDoc.querySelector("a[href^='mailto:']");
    const aboutMailto = aboutDoc.querySelector("a[href^='mailto:']");
    expect(browseMailto).not.toBeNull();
    expect(aboutMailto).not.toBeNull();
    expect(browseMailto.getAttribute("href")).toContain("akhilreddydanda");
    expect(aboutMailto.getAttribute("href")).toContain("akhilreddydanda");
  });
});

// ── All Pages Valid HTML ─────────────────────────────────────────────────────

describe("All Pages Valid HTML", () => {
  it("index.html has DOCTYPE, html, head, and body elements", () => {
    expect(indexHtml).toMatch(/<!DOCTYPE html>/i);
    expect(indexDoc.documentElement.tagName).toBe("HTML");
    expect(indexDoc.head).not.toBeNull();
    expect(indexDoc.body).not.toBeNull();
  });

  it("browse.html has DOCTYPE, html, head, and body elements", () => {
    expect(browseHtml).toMatch(/<!DOCTYPE html>/i);
    expect(browseDoc.documentElement.tagName).toBe("HTML");
    expect(browseDoc.head).not.toBeNull();
    expect(browseDoc.body).not.toBeNull();
  });

  it("about.html has DOCTYPE, html, head, and body elements", () => {
    expect(aboutHtml).toMatch(/<!DOCTYPE html>/i);
    expect(aboutDoc.documentElement.tagName).toBe("HTML");
    expect(aboutDoc.head).not.toBeNull();
    expect(aboutDoc.body).not.toBeNull();
  });
});
