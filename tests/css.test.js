/**
 * Tests for netflix-styles.css — shared stylesheet: custom properties, layout
 * selectors, component selectors, button styles, skill progress variants,
 * responsive breakpoints, and special components. Uses string/regex matching
 * against the raw CSS source.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const cssPath = resolve(__dirname, "../netflix-styles.css");
const css = readFileSync(cssPath, "utf-8");

// ── CSS Custom Properties ─────────────────────────────────────────────────────

describe("CSS Custom Properties", () => {
  it(":root block exists", () => {
    expect(css).toMatch(/:root\s*\{/);
  });

  it("defines --netflix-red variable", () => {
    expect(css).toMatch(/--netflix-red\s*:/);
  });

  it("defines --bg-dark variable", () => {
    expect(css).toMatch(/--bg-dark\s*:/);
  });

  it("defines --bg-darker variable", () => {
    expect(css).toMatch(/--bg-darker\s*:/);
  });

  it("defines --bg-card variable", () => {
    expect(css).toMatch(/--bg-card\s*:/);
  });

  it("defines --text-white variable", () => {
    expect(css).toMatch(/--text-white\s*:/);
  });

  it("defines --text-gray variable", () => {
    expect(css).toMatch(/--text-gray\s*:/);
  });

  it("defines --transition variable", () => {
    expect(css).toMatch(/--transition\s*:/);
  });
});

// ── Core Layout Selectors ─────────────────────────────────────────────────────

describe("Core Layout Selectors", () => {
  it(".navbar selector exists", () => {
    expect(css).toMatch(/\.navbar\s*\{/);
  });

  it(".navbar.scrolled selector exists", () => {
    expect(css).toMatch(/\.navbar\.scrolled\s*\{/);
  });

  it(".hero selector exists", () => {
    expect(css).toMatch(/\.hero\s*\{/);
  });

  it(".hero-gradient selector exists", () => {
    expect(css).toMatch(/\.hero-gradient\s*\{/);
  });

  it(".hero-content selector exists", () => {
    expect(css).toMatch(/\.hero-content\s*\{/);
  });

  it(".footer selector exists", () => {
    expect(css).toMatch(/\.footer\s*\{/);
  });

  it("body selector defines font-family", () => {
    expect(css).toMatch(/body\s*\{[^}]*font-family\s*:/s);
  });

  it(".dark-section selector exists", () => {
    expect(css).toMatch(/\.dark-section\s*\{/);
  });
});

// ── Component Selectors ───────────────────────────────────────────────────────

describe("Component Selectors", () => {
  it(".netflix-row selector exists", () => {
    expect(css).toMatch(/\.netflix-row\s*\{/);
  });

  it(".netflix-card selector exists", () => {
    expect(css).toMatch(/\.netflix-card\s*\{/);
  });

  it(".experience-card selector exists", () => {
    expect(css).toMatch(/\.experience-card\s*\{/);
  });

  it(".experience-card.microsoft selector sets border-left with #0078D4", () => {
    expect(css).toMatch(/\.experience-card\.microsoft\s*\{[^}]*0078D4/si);
  });

  it(".experience-card.amazon selector exists", () => {
    expect(css).toMatch(/\.experience-card\.amazon\s*\{/);
  });

  it(".skill-card-new selector exists", () => {
    expect(css).toMatch(/\.skill-card-new\s*\{/);
  });

  it(".daily-card selector exists", () => {
    expect(css).toMatch(/\.daily-card\s*\{/);
  });

  it(".daily-card.featured selector exists", () => {
    expect(css).toMatch(/\.daily-card\.featured\s*\{/);
  });

  it(".cert-badge selector exists", () => {
    expect(css).toMatch(/\.cert-badge\s*\{/);
  });

  it(".contact-section selector exists", () => {
    expect(css).toMatch(/\.contact-section\s*\{/);
  });
});

// ── Button Styles ─────────────────────────────────────────────────────────────

describe("Button Styles", () => {
  it(".btn-play selector exists", () => {
    expect(css).toMatch(/\.btn-play\s*\{/);
  });

  it(".btn-info selector exists", () => {
    expect(css).toMatch(/\.btn-info\s*\{/);
  });

  it(".hero-buttons selector exists", () => {
    expect(css).toMatch(/\.hero-buttons\s*\{/);
  });

  it(".btn-play includes a background property", () => {
    expect(css).toMatch(/\.btn-play\s*\{[^}]*background\s*:/s);
  });

  it(".btn-play includes a color property", () => {
    expect(css).toMatch(/\.btn-play\s*\{[^}]*color\s*:/s);
  });

  it(".btn-info includes a background property", () => {
    expect(css).toMatch(/\.btn-info\s*\{[^}]*background\s*:/s);
  });
});

// ── Skill Progress Variants ───────────────────────────────────────────────────

describe("Skill Progress Variants", () => {
  it(".skill-progress.aws selector exists", () => {
    expect(css).toMatch(/\.skill-progress\.aws\s*\{/);
  });

  it(".skill-progress.azure selector exists", () => {
    expect(css).toMatch(/\.skill-progress\.azure\s*\{/);
  });

  it(".skill-progress.k8s selector exists", () => {
    expect(css).toMatch(/\.skill-progress\.k8s\s*\{/);
  });

  it(".skill-progress.docker selector exists", () => {
    expect(css).toMatch(/\.skill-progress\.docker\s*\{/);
  });

  it(".skill-progress.ml selector exists", () => {
    expect(css).toMatch(/\.skill-progress\.ml\s*\{/);
  });

  it(".skill-progress.aws uses an orange gradient (#ff9900)", () => {
    expect(css).toMatch(/\.skill-progress\.aws\s*\{[^}]*ff9900/si);
  });

  it(".skill-progress.azure uses a blue gradient (#0078d4)", () => {
    expect(css).toMatch(/\.skill-progress\.azure\s*\{[^}]*0078d4/si);
  });
});

// ── Responsive Design ─────────────────────────────────────────────────────────

describe("Responsive Design", () => {
  it("@media (max-width: 900px) breakpoint exists", () => {
    expect(css).toContain("max-width: 900px");
  });

  it("@media (max-width: 600px) breakpoint exists", () => {
    expect(css).toContain("max-width: 600px");
  });

  it("900px breakpoint hides .nav-menu", () => {
    const block900 = css.match(/@media\s*\(max-width:\s*900px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block900).not.toBeNull();
    expect(block900[1]).toMatch(/\.nav-menu\s*\{[^}]*display\s*:\s*none/s);
  });

  it("600px breakpoint hides .featured-skills", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.featured-skills\s*\{[^}]*display\s*:\s*none/s);
  });

  it("900px breakpoint reduces .hero-title font-size", () => {
    const block900 = css.match(/@media\s*\(max-width:\s*900px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block900).not.toBeNull();
    expect(block900[1]).toMatch(/\.hero-title\s*\{[^}]*font-size/s);
  });

  it("600px breakpoint stacks .hero-buttons vertically", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.hero-buttons\s*\{[^}]*flex-direction\s*:\s*column/s);
  });
});

// ── Special Components ────────────────────────────────────────────────────────

describe("Special Components", () => {
  it(".ds-tag selector exists", () => {
    expect(css).toMatch(/\.ds-tag\s*\{/);
  });

  it(".new-ribbon selector exists with position: absolute", () => {
    expect(css).toMatch(/\.new-ribbon\s*\{[^}]*position\s*:\s*absolute/s);
  });

  it(".msft-prep-card selector exists", () => {
    expect(css).toMatch(/\.msft-prep-card\s*\{/);
  });

  it(".daily-shipping-section selector exists", () => {
    expect(css).toMatch(/\.daily-shipping-section\s*\{/);
  });

  it(".nav-profile-img or .mini-avatar avatar-related selector exists", () => {
    expect(css).toMatch(/\.nav-profile-img\s*\{|\.mini-avatar\s*\{/);
  });

  it(".new-ribbon uses a rotate transform", () => {
    expect(css).toMatch(/\.new-ribbon\s*\{[^}]*transform\s*:[^}]*rotate/s);
  });

  it(".msft-prep-card hover state changes border-color to #0078D4", () => {
    expect(css).toMatch(/\.msft-prep-card:hover\s*\{[^}]*0078D4/si);
  });

  it(".ds-tag hover state changes border-color toward netflix red (#E50914)", () => {
    expect(css).toMatch(/\.ds-tag:hover\s*\{[^}]*E50914/si);
  });

  it(".daily-shipping-section includes a padding property", () => {
    expect(css).toMatch(/\.daily-shipping-section\s*\{[^}]*padding\s*:/s);
  });
});

// ── Animations and Keyframes ──────────────────────────────────────────────────

describe("Animations and Keyframes", () => {
  it("@keyframes pulse is defined", () => {
    expect(css).toMatch(/@keyframes\s+pulse\s*\{/);
  });

  it("pulse keyframe uses box-shadow", () => {
    expect(css).toMatch(/@keyframes\s+pulse\s*\{[^}]*box-shadow/s);
  });

  it(".day-badge.new applies the pulse animation", () => {
    expect(css).toMatch(/\.day-badge\.new\s*\{[^}]*animation\s*:[^}]*pulse/s);
  });
});

// ── Missing Selectors ─────────────────────────────────────────────────────────

describe("Missing Selectors", () => {
  it(".journey-section selector exists", () => {
    expect(css).toMatch(/\.journey-section\s*\{/);
  });

  it(".journey-banner selector exists", () => {
    expect(css).toMatch(/\.journey-banner\s*\{/);
  });

  it(".journey-progress selector exists", () => {
    expect(css).toMatch(/\.journey-progress\s*\{/);
  });

  it(".stat selector exists", () => {
    expect(css).toMatch(/\.stat\s*\{/);
  });

  it(".stat-number selector exists", () => {
    expect(css).toMatch(/\.stat-number\s*\{/);
  });

  it(".stat-label selector exists", () => {
    expect(css).toMatch(/\.stat-label\s*\{/);
  });

  it(".card selector exists", () => {
    expect(css).toMatch(/\.card\s*\{/);
  });

  it(".card:hover selector exists", () => {
    expect(css).toMatch(/\.card:hover\s*\{/);
  });

  it(".card-image selector exists", () => {
    expect(css).toMatch(/\.card-image\s*\{/);
  });

  it(".card-info selector exists", () => {
    expect(css).toMatch(/\.card-info\s*\{/);
  });

  it(".netflix-row::-webkit-scrollbar selector exists", () => {
    expect(css).toMatch(/\.netflix-row::-webkit-scrollbar\s*\{/);
  });

  it(".progress-indicator selector exists", () => {
    expect(css).toMatch(/\.progress-indicator\s*\{/);
  });

  it(".mini-face selector exists", () => {
    expect(css).toMatch(/\.mini-face\s*\{/);
  });

  it(".mini-eyes selector exists", () => {
    expect(css).toMatch(/\.mini-eyes\s*\{/);
  });

  it(".mini-eye selector exists", () => {
    expect(css).toMatch(/\.mini-eye\s*\{/);
  });

  it(".hero-video selector exists", () => {
    expect(css).toMatch(/\.hero-video\s*\{/);
  });
});

// ── Avatar Gradient Variants ──────────────────────────────────────────────────

describe("Avatar Gradient Variants", () => {
  it(".avatar-recruiter selector exists with a gradient", () => {
    expect(css).toMatch(/\.avatar-recruiter\s*\{[^}]*linear-gradient/s);
  });

  it(".avatar-developer selector exists with a gradient", () => {
    expect(css).toMatch(/\.avatar-developer\s*\{[^}]*linear-gradient/s);
  });

  it(".avatar-stalker selector exists with a gradient", () => {
    expect(css).toMatch(/\.avatar-stalker\s*\{[^}]*linear-gradient/s);
  });

  it(".avatar-adventurer selector exists with a gradient", () => {
    expect(css).toMatch(/\.avatar-adventurer\s*\{[^}]*linear-gradient/s);
  });
});

// ── Mobile Media Query Depth ──────────────────────────────────────────────────

describe("Mobile Media Query Depth", () => {
  it("600px breakpoint hides .hero-video", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.hero-video\s*\{[^}]*display\s*:\s*none/s);
  });

  it("600px breakpoint makes .daily-cards-grid single column", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.daily-cards-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/s);
  });

  it("900px breakpoint sets .journey-banner flex-direction to column", () => {
    const block900 = css.match(/@media\s*\(max-width:\s*900px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block900).not.toBeNull();
    expect(block900[1]).toMatch(/\.journey-banner\s*\{[^}]*flex-direction\s*:\s*column/s);
  });

  it("900px breakpoint makes .skills-grid-new single column", () => {
    const block900 = css.match(/@media\s*\(max-width:\s*900px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block900).not.toBeNull();
    expect(block900[1]).toMatch(/\.skills-grid-new\s*\{[^}]*grid-template-columns\s*:\s*1fr/s);
  });

  it("600px breakpoint reduces .hero-title font-size to 1.6rem", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.hero-title\s*\{[^}]*font-size\s*:\s*1\.6rem/s);
  });

  it("600px breakpoint collapses .edu-grid to single column", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.edu-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/s);
  });

  it("600px breakpoint sets .cert-row to flex-direction: column", () => {
    const block600 = css.match(/@media\s*\(max-width:\s*600px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block600).not.toBeNull();
    expect(block600[1]).toMatch(/\.cert-row\s*\{[^}]*flex-direction\s*:\s*column/s);
  });

  it("900px breakpoint collapses .experience-grid to single column", () => {
    const block900 = css.match(/@media\s*\(max-width:\s*900px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block900).not.toBeNull();
    expect(block900[1]).toMatch(/\.experience-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/s);
  });
});

// ── Scrollbar Rules ───────────────────────────────────────────────────────────

describe("Scrollbar Rules", () => {
  it(".netflix-row::-webkit-scrollbar hides the scrollbar", () => {
    expect(css).toMatch(/\.netflix-row::-webkit-scrollbar\s*\{[^}]*display\s*:\s*none/s);
  });

  it(".row-content::-webkit-scrollbar selector exists", () => {
    expect(css).toMatch(/\.row-content::-webkit-scrollbar\s*\{/);
  });

  it(".row-content::-webkit-scrollbar hides the scrollbar", () => {
    expect(css).toMatch(/\.row-content::-webkit-scrollbar\s*\{[^}]*display\s*:\s*none/s);
  });

  it(".netflix-row has scrollbar-width: none (Firefox)", () => {
    expect(css).toMatch(/\.netflix-row\s*\{[^}]*scrollbar-width\s*:\s*none/s);
  });
});

// ── Hover States ──────────────────────────────────────────────────────────────

describe("Hover States", () => {
  it(".netflix-card:hover applies transform: scale(1.1)", () => {
    expect(css).toMatch(/\.netflix-card:hover\s*\{[^}]*transform\s*:[^}]*scale\(1\.1\)/s);
  });

  it(".experience-card:hover lifts element with translateY(-5px)", () => {
    expect(css).toMatch(/\.experience-card:hover\s*\{[^}]*transform\s*:[^}]*translateY\(-5px\)/s);
  });

  it(".daily-card:hover lifts element with translateY(-10px)", () => {
    expect(css).toMatch(/\.daily-card:hover\s*\{[^}]*transform\s*:[^}]*translateY\(-10px\)/s);
  });

  it(".contact-link:hover changes background color", () => {
    expect(css).toMatch(/\.contact-link:hover\s*\{[^}]*background\s*:/s);
  });
});
