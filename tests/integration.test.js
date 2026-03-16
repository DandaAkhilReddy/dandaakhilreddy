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

// Load all 11 project pages once at module level for reuse across describe blocks
const dailyProjectFiles = [
  "projects/day-1-llm-ios.html",
  "projects/day-2-claude-peepee.html",
  "projects/day-3-speakskiptype.html",
  "projects/day-4-audtext.html",
  "projects/day-minus-5-wifivision.html",
  "projects/day-6-localbrowsercontrol.html",
  "projects/day-7-reddyhedgefund.html",
  "projects/day-8-stock-analyzer.html",
];

const academicProjectFiles = [
  "projects/adas-system.html",
  "projects/financial-sentiment.html",
  "projects/healthcare-rag.html",
];

const allProjectFiles = [...dailyProjectFiles, ...academicProjectFiles];

const projectDocs = allProjectFiles.map((file) => ({
  file,
  ...loadDoc(file),
}));

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

  it("projects/ directory exists with at least 12 HTML files", () => {
    expect(existsSync(resolve(ROOT, "projects"))).toBe(true);
    allProjectFiles.forEach((file) => {
      expect(existsSync(resolve(ROOT, file))).toBe(true);
    });
    expect(allProjectFiles.length).toBeGreaterThanOrEqual(11);
  });

  it("projects/project-styles.css exists", () => {
    expect(existsSync(resolve(ROOT, "projects/project-styles.css"))).toBe(true);
  });

  it("all who's-watching images referenced via src in index.html exist on disk", () => {
    const imgs = [...indexDoc.querySelectorAll("img[src]")].filter((img) => {
      const src = img.getAttribute("src");
      return src && !src.startsWith("http") && !src.startsWith("//");
    });
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      expect(existsSync(resolve(ROOT, src))).toBe(true);
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

  it("author name 'Akhil' appears in all 3 main page DOMs", () => {
    [
      { name: "index.html", html: indexHtml },
      { name: "browse.html", html: browseHtml },
      { name: "about.html", html: aboutHtml },
    ].forEach(({ name, html }) => {
      expect(html).toMatch(/akhil/i);
    });
  });

  it("GitHub username 'DandaAkhilReddy' appears in browse.html and about.html", () => {
    expect(browseHtml).toContain("DandaAkhilReddy");
    expect(aboutHtml).toContain("DandaAkhilReddy");
  });

  it("LinkedIn URL appears in both browse.html and about.html", () => {
    expect(browseHtml).toContain("linkedin.com/in/akhil-reddy-danda");
    expect(aboutHtml).toContain("linkedin.com/in/akhil-reddy-danda");
  });

  it("contact section exists in browse.html", () => {
    const contactSection = browseDoc.querySelector("#contact, .contact-section");
    expect(contactSection).not.toBeNull();
  });

  it("connect/contact section exists in about.html", () => {
    // about.html uses .connect-section instead of #contact
    const connectSection = aboutDoc.querySelector(
      ".connect-section, #contact, .contact-section"
    );
    expect(connectSection).not.toBeNull();
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

// ── Project Page Navigation ──────────────────────────────────────────────────

describe("Project Page Navigation", () => {
  it("all 8 daily-card onclick attributes in browse.html contain valid project filenames", () => {
    const dailyCards = [
      ...browseDoc.querySelectorAll(".daily-card[onclick]"),
    ];
    expect(dailyCards.length).toBe(8);
    dailyCards.forEach((card) => {
      const onclick = card.getAttribute("onclick");
      // Must match pattern: window.location.href='projects/<filename>.html'
      expect(onclick).toMatch(/window\.location\.href='projects\/[^']+\.html'/);
      // The referenced file must exist on disk
      const match = onclick.match(/projects\/[^']+\.html/);
      expect(match).not.toBeNull();
      expect(existsSync(resolve(ROOT, match[0]))).toBe(true);
    });
  });

  it("all 3 academic project onclick attributes in browse.html contain valid project filenames", () => {
    const academicCards = [
      ...browseDoc.querySelectorAll(".netflix-card[onclick*='projects/']"),
    ];
    expect(academicCards.length).toBeGreaterThanOrEqual(3);
    academicCards.forEach((card) => {
      const onclick = card.getAttribute("onclick");
      const match = onclick.match(/projects\/[^']+\.html/);
      expect(match).not.toBeNull();
      expect(existsSync(resolve(ROOT, match[0]))).toBe(true);
    });
  });

  it("each of the 11 project page files can be loaded as valid HTML", () => {
    projectDocs.forEach(({ file, doc, html }) => {
      expect(html).toMatch(/<!DOCTYPE html>/i);
      expect(doc.documentElement.tagName).toBe("HTML");
      expect(doc.head).not.toBeNull();
      expect(doc.body).not.toBeNull();
    });
  });

  it("all project pages have a back-link pointing to ../browse.html", () => {
    projectDocs.forEach(({ file, doc }) => {
      const backLink = doc.querySelector(".back-link[href]");
      expect(backLink).not.toBeNull();
      expect(backLink.getAttribute("href")).toMatch(/\.\.\/browse\.html/);
    });
  });

  it("all project pages reference ../netflix-styles.css", () => {
    projectDocs.forEach(({ file, doc }) => {
      const link = doc.querySelector("link[href='../netflix-styles.css']");
      expect(link).not.toBeNull();
    });
  });

  it("all project pages reference project-styles.css", () => {
    projectDocs.forEach(({ file, doc }) => {
      const link = doc.querySelector("link[href='project-styles.css']");
      expect(link).not.toBeNull();
    });
  });
});

// ── Shared Resources ─────────────────────────────────────────────────────────

describe("Shared Resources", () => {
  it("Google Fonts link is present on all 3 main pages", () => {
    [
      { name: "index.html", html: indexHtml },
      { name: "browse.html", html: browseHtml },
      { name: "about.html", html: aboutHtml },
    ].forEach(({ name, html }) => {
      expect(html).toContain("fonts.googleapis.com");
    });
  });

  it("all 3 main pages have a viewport meta tag", () => {
    [
      { name: "index.html", doc: indexDoc },
      { name: "browse.html", doc: browseDoc },
      { name: "about.html", doc: aboutDoc },
    ].forEach(({ name, doc }) => {
      const viewport = doc.querySelector("meta[name='viewport']");
      expect(viewport).not.toBeNull();
      expect(viewport.getAttribute("content")).toContain("width=device-width");
    });
  });

  it("all 3 main pages declare charset UTF-8", () => {
    [
      { name: "index.html", doc: indexDoc },
      { name: "browse.html", doc: browseDoc },
      { name: "about.html", doc: aboutDoc },
    ].forEach(({ name, doc }) => {
      const charset = doc.querySelector("meta[charset]");
      expect(charset).not.toBeNull();
      expect(charset.getAttribute("charset").toUpperCase()).toBe("UTF-8");
    });
  });

  it("netflix-styles.css exists on disk", () => {
    expect(existsSync(resolve(ROOT, "netflix-styles.css"))).toBe(true);
  });
});

// ── Full Navigation Graph ────────────────────────────────────────────────────

describe("Full Navigation Graph", () => {
  it("index.html links to browse.html via exactly 4 profile cards", () => {
    const profileCards = [
      ...indexDoc.querySelectorAll("a.profile-card[href*='browse.html']"),
    ];
    expect(profileCards.length).toBe(4);
  });

  it("browse.html links to about.html via a nav link", () => {
    const aboutLink = browseDoc.querySelector("a[href='about.html']");
    expect(aboutLink).not.toBeNull();
  });

  it("browse.html links to all 11 project pages via onclick attributes", () => {
    allProjectFiles.forEach((file) => {
      // file is e.g. "projects/day-1-llm-ios.html" — extract the path used in onclick
      expect(browseHtml).toContain(`'${file}'`);
    });
  });

  it("about.html links back to browse.html via the floating back-link button", () => {
    const backLink = aboutDoc.querySelector("a.back-link[href='browse.html']");
    expect(backLink).not.toBeNull();
  });

  it("all project pages link back to browse.html via both nav logo and back-link", () => {
    projectDocs.forEach(({ file, doc }) => {
      // Nav logo
      const navLogo = doc.querySelector("a.nav-logo[href='../browse.html']");
      expect(navLogo).not.toBeNull();
      // Back-link
      const backLink = doc.querySelector(".back-link[href]");
      expect(backLink).not.toBeNull();
      expect(backLink.getAttribute("href")).toContain("../browse.html");
    });
  });
});

// ── CSS File Consistency ─────────────────────────────────────────────────────

describe("CSS File Consistency", () => {
  it("all 11 project pages link ../netflix-styles.css", () => {
    projectDocs.forEach(({ file, doc }) => {
      const link = doc.querySelector("link[href='../netflix-styles.css']");
      expect(link).not.toBeNull();
    });
  });

  it("all 11 project pages link project-styles.css", () => {
    projectDocs.forEach(({ file, doc }) => {
      const link = doc.querySelector("link[href='project-styles.css']");
      expect(link).not.toBeNull();
    });
  });

  it("projects/project-styles.css file exists on disk", () => {
    expect(existsSync(resolve(ROOT, "projects/project-styles.css"))).toBe(true);
  });

  it("netflix-styles.css file exists on disk", () => {
    expect(existsSync(resolve(ROOT, "netflix-styles.css"))).toBe(true);
  });
});

// ── Footer Consistency ────────────────────────────────────────────────────────

describe("Footer Consistency", () => {
  it("browse.html has a footer element", () => {
    expect(browseDoc.querySelector("footer")).not.toBeNull();
  });

  it("about.html has a footer element", () => {
    expect(aboutDoc.querySelector("footer")).not.toBeNull();
  });

  it("browse.html footer contains copyright or year text", () => {
    const footer = browseDoc.querySelector("footer");
    expect(footer.textContent).toMatch(/©|copyright|2026/i);
  });
});

// ── Meta Tag Consistency ──────────────────────────────────────────────────────

describe("Meta Tag Consistency", () => {
  const mainPages = [
    { name: "index.html", doc: indexDoc },
    { name: "browse.html", doc: browseDoc },
    { name: "about.html", doc: aboutDoc },
  ];

  it("all 3 main pages have a viewport meta tag with width=device-width", () => {
    mainPages.forEach(({ name, doc }) => {
      const viewport = doc.querySelector("meta[name='viewport']");
      expect(viewport).not.toBeNull();
      expect(viewport.getAttribute("content")).toContain("width=device-width");
    });
  });

  it("all 3 main pages declare charset UTF-8", () => {
    mainPages.forEach(({ name, doc }) => {
      const charset = doc.querySelector("meta[charset]");
      expect(charset).not.toBeNull();
      expect(charset.getAttribute("charset").toUpperCase()).toBe("UTF-8");
    });
  });

  it("all 3 main pages have a non-empty <title>", () => {
    mainPages.forEach(({ name, doc }) => {
      expect(doc.title.trim().length).toBeGreaterThan(0);
    });
  });
});

// ── Bidirectional Navigation ──────────────────────────────────────────────────

describe("Bidirectional Navigation", () => {
  it("all 11 project pages have a back-link href containing ../browse.html", () => {
    projectDocs.forEach(({ file, doc }) => {
      const backLink = doc.querySelector(".back-link[href]");
      expect(backLink).not.toBeNull();
      expect(backLink.getAttribute("href")).toContain("../browse.html");
    });
  });

  it("browse.html onclick attributes reference all 8 daily project pages", () => {
    dailyProjectFiles.forEach((file) => {
      expect(browseHtml).toContain(`'${file}'`);
    });
  });

  it("browse.html onclick attributes reference all 3 academic project pages", () => {
    academicProjectFiles.forEach((file) => {
      expect(browseHtml).toContain(`'${file}'`);
    });
  });

  it("all project pages nav logo links back to ../browse.html", () => {
    projectDocs.forEach(({ file, doc }) => {
      const navLogo = doc.querySelector("a.nav-logo[href='../browse.html']");
      expect(navLogo).not.toBeNull();
    });
  });
});

// ── Profile Query Param ───────────────────────────────────────────────────────

describe("Profile Query Param", () => {
  it("browse.html script uses URLSearchParams to read the profile param", () => {
    expect(browseHtml).toContain("URLSearchParams");
  });

  it("browse.html script falls back to 'recruiter' when no profile param is present", () => {
    expect(browseHtml).toContain("|| 'recruiter'");
  });

  it("profileConfig in browse.html contains the 'developer' key", () => {
    expect(browseHtml).toContain("developer:");
  });

  it("profileConfig in browse.html contains the 'visitor' key", () => {
    expect(browseHtml).toContain("visitor:");
  });
});

// ── Smooth Scroll Targets ─────────────────────────────────────────────────────

describe("Smooth Scroll Targets", () => {
  it("section id='home' exists in browse.html", () => {
    expect(browseDoc.getElementById("home")).not.toBeNull();
  });

  it("section id='experience' exists in browse.html", () => {
    expect(browseDoc.getElementById("experience")).not.toBeNull();
  });

  it("section id='skills' exists in browse.html", () => {
    expect(browseDoc.getElementById("skills")).not.toBeNull();
  });

  it("section id='contact' exists in browse.html", () => {
    expect(browseDoc.getElementById("contact")).not.toBeNull();
  });
});

// ── Asset Format ──────────────────────────────────────────────────────────────

describe("Asset Format", () => {
  it("netflix-sound.mp3 source in index.html has type audio/mpeg", () => {
    const audioSource = indexDoc.querySelector("source[src*='netflix-sound.mp3']");
    expect(audioSource).not.toBeNull();
    expect(audioSource.getAttribute("type")).toBe("audio/mpeg");
  });

  it("Unsplash image URLs in browse.html use images.unsplash.com domain", () => {
    const imgs = [...browseDoc.querySelectorAll("img[src*='unsplash.com']")];
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((img) => {
      expect(img.getAttribute("src")).toMatch(/^https:\/\/images\.unsplash\.com\//);
    });
  });

  it("Unsplash image URLs in browse.html include crop parameters", () => {
    const imgs = [...browseDoc.querySelectorAll("img[src*='unsplash.com']")];
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((img) => {
      expect(img.getAttribute("src")).toContain("fit=crop");
    });
  });

  it("assets/netflix-sound.mp3 exists on disk", () => {
    expect(existsSync(resolve(ROOT, "assets/netflix-sound.mp3"))).toBe(true);
  });
});

// ── Cross-Page Links ──────────────────────────────────────────────────────────

describe("Cross-Page Links", () => {
  it("about.html has at least one link back to browse.html", () => {
    const links = [...aboutDoc.querySelectorAll("a[href]")].filter((a) =>
      a.getAttribute("href").includes("browse.html")
    );
    expect(links.length).toBeGreaterThan(0);
  });

  it("all project pages back-links resolve to ../browse.html", () => {
    projectDocs.forEach(({ file, doc }) => {
      const backLink = doc.querySelector(".back-link[href]");
      expect(backLink).not.toBeNull();
      expect(backLink.getAttribute("href")).toContain("../browse.html");
    });
  });

  it("nav logo in browse.html points to index.html", () => {
    const navLogo = browseDoc.querySelector("a.nav-logo");
    expect(navLogo).not.toBeNull();
    expect(navLogo.getAttribute("href")).toBe("index.html");
  });

  it("nav logo in all project pages points to ../browse.html", () => {
    projectDocs.forEach(({ file, doc }) => {
      const navLogo = doc.querySelector("a.nav-logo");
      expect(navLogo).not.toBeNull();
      expect(navLogo.getAttribute("href")).toBe("../browse.html");
    });
  });
});

// ── Script Consistency ────────────────────────────────────────────────────────

describe("Script Consistency", () => {
  it("index.html has at least one inline <script> tag", () => {
    const scripts = [...indexDoc.querySelectorAll("script")].filter(
      (s) => !s.getAttribute("src")
    );
    expect(scripts.length).toBeGreaterThan(0);
  });

  it("browse.html has at least one inline <script> tag", () => {
    const scripts = [...browseDoc.querySelectorAll("script")].filter(
      (s) => !s.getAttribute("src")
    );
    expect(scripts.length).toBeGreaterThan(0);
  });

  it("about.html has at least one inline <script> tag", () => {
    const scripts = [...aboutDoc.querySelectorAll("script")].filter(
      (s) => !s.getAttribute("src")
    );
    expect(scripts.length).toBeGreaterThan(0);
  });

  it("all project pages have at least one inline script with IntersectionObserver", () => {
    projectDocs.forEach(({ file, html }) => {
      expect(html).toContain("IntersectionObserver");
    });
  });

  it("index.html does not reference any external .js files via <script src>", () => {
    const externalScripts = [...indexDoc.querySelectorAll("script[src]")].filter(
      (s) => !s.getAttribute("src").startsWith("http")
    );
    expect(externalScripts.length).toBe(0);
  });
});

// ── No Broken Internal Links ─────────────────────────────────────────────────

describe("No Broken Internal Links", () => {
  it("all local href links in index.html resolve to existing files", () => {
    const localLinks = [
      ...indexDoc.querySelectorAll("a[href]"),
    ].filter((a) => {
      const href = a.getAttribute("href");
      // Keep only relative paths that reference .html files (no anchors, no external)
      return (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        href.endsWith(".html")
      );
    });
    localLinks.forEach((a) => {
      const href = a.getAttribute("href").split("?")[0]; // strip query string
      expect(existsSync(resolve(ROOT, href))).toBe(true);
    });
  });

  it("all local href links in about.html resolve to existing files", () => {
    const localLinks = [
      ...aboutDoc.querySelectorAll("a[href]"),
    ].filter((a) => {
      const href = a.getAttribute("href");
      return (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        href.endsWith(".html")
      );
    });
    // about.html has browse.html and index.html links — both must exist
    localLinks.forEach((a) => {
      const href = a.getAttribute("href").split("#")[0]; // strip fragment
      expect(existsSync(resolve(ROOT, href))).toBe(true);
    });
  });

  it("all local img src paths in index.html exist on disk", () => {
    const localImgs = [
      ...indexDoc.querySelectorAll("img[src]"),
    ].filter((img) => {
      const src = img.getAttribute("src");
      return src && !src.startsWith("http") && !src.startsWith("//");
    });
    expect(localImgs.length).toBeGreaterThan(0);
    localImgs.forEach((img) => {
      const src = img.getAttribute("src");
      expect(existsSync(resolve(ROOT, src))).toBe(true);
    });
  });
});
