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
