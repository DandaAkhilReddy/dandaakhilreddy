/**
 * Tests for projects/project-styles.css — project page stylesheet: back-link,
 * hero, tech stack, content blocks, features, install steps, code blocks,
 * architecture diagram, CTA section, animation classes, hover states, tech icon
 * variants, architecture variants, responsive breakpoints, and color/layout values.
 * Uses string/regex matching against the raw CSS source.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const cssPath = resolve(__dirname, "../projects/project-styles.css");
const css = readFileSync(cssPath, "utf-8");

// ── Core Selectors ────────────────────────────────────────────────────────────

describe("Core Selectors", () => {
  it(".back-link selector exists", () => {
    expect(css).toMatch(/\.back-link\s*\{/);
  });

  it(".back-link includes text-decoration: none", () => {
    expect(css).toMatch(/\.back-link\s*\{[^}]*text-decoration\s*:\s*none/s);
  });

  it(".project-hero selector exists", () => {
    expect(css).toMatch(/\.project-hero\s*\{/);
  });

  it(".project-hero includes position: relative", () => {
    expect(css).toMatch(/\.project-hero\s*\{[^}]*position\s*:\s*relative/s);
  });

  it(".project-hero-content selector exists", () => {
    expect(css).toMatch(/\.project-hero-content\s*\{/);
  });

  it(".project-hero-content includes max-width", () => {
    expect(css).toMatch(/\.project-hero-content\s*\{[^}]*max-width\s*:/s);
  });

  it(".project-badge-large selector exists", () => {
    expect(css).toMatch(/\.project-badge-large\s*\{/);
  });

  it(".project-badge-large uses inline-block display", () => {
    expect(css).toMatch(/\.project-badge-large\s*\{[^}]*display\s*:\s*inline-block/s);
  });

  it(".project-title selector exists", () => {
    expect(css).toMatch(/\.project-title\s*\{/);
  });

  it(".project-title sets font-size to 3.5rem", () => {
    expect(css).toMatch(/\.project-title\s*\{[^}]*font-size\s*:\s*3\.5rem/s);
  });

  it(".project-tagline selector exists", () => {
    expect(css).toMatch(/\.project-tagline\s*\{/);
  });

  it(".project-description selector exists", () => {
    expect(css).toMatch(/\.project-description\s*\{/);
  });

  it(".project-links selector exists", () => {
    expect(css).toMatch(/\.project-links\s*\{/);
  });

  it(".project-links uses flex display", () => {
    expect(css).toMatch(/\.project-links\s*\{[^}]*display\s*:\s*flex/s);
  });

  it(".tech-grid selector exists", () => {
    expect(css).toMatch(/\.tech-grid\s*\{/);
  });

  it(".tech-grid uses display: grid", () => {
    expect(css).toMatch(/\.tech-grid\s*\{[^}]*display\s*:\s*grid/s);
  });

  it(".tech-item selector exists", () => {
    expect(css).toMatch(/\.tech-item\s*\{/);
  });

  it(".tech-item starts with opacity: 0 (hidden before animation)", () => {
    expect(css).toMatch(/\.tech-item\s*\{[^}]*opacity\s*:\s*0/s);
  });

  it(".tech-icon selector exists", () => {
    expect(css).toMatch(/\.tech-icon\s*\{/);
  });

  it(".tech-icon sets width: 60px", () => {
    expect(css).toMatch(/\.tech-icon\s*\{[^}]*width\s*:\s*60px/s);
  });

  it(".content-grid selector exists", () => {
    expect(css).toMatch(/\.content-grid\s*\{/);
  });

  it(".content-grid uses display: grid", () => {
    expect(css).toMatch(/\.content-grid\s*\{[^}]*display\s*:\s*grid/s);
  });

  it(".content-block selector exists", () => {
    expect(css).toMatch(/\.content-block\s*\{/);
  });

  it(".content-block starts with opacity: 0", () => {
    expect(css).toMatch(/\.content-block\s*\{[^}]*opacity\s*:\s*0/s);
  });

  it(".feature-list selector exists", () => {
    expect(css).toMatch(/\.feature-list\s*\{/);
  });

  it(".feature-list sets list-style: none", () => {
    expect(css).toMatch(/\.feature-list\s*\{[^}]*list-style\s*:\s*none/s);
  });

  it(".features-grid selector exists", () => {
    expect(css).toMatch(/\.features-grid\s*\{/);
  });

  it(".features-grid uses display: grid", () => {
    expect(css).toMatch(/\.features-grid\s*\{[^}]*display\s*:\s*grid/s);
  });

  it(".feature-card selector exists", () => {
    expect(css).toMatch(/\.feature-card\s*\{/);
  });

  it(".feature-card starts with opacity: 0", () => {
    expect(css).toMatch(/\.feature-card\s*\{[^}]*opacity\s*:\s*0/s);
  });

  it(".install-steps selector exists", () => {
    expect(css).toMatch(/\.install-steps\s*\{/);
  });

  it(".install-steps includes max-width: 800px", () => {
    expect(css).toMatch(/\.install-steps\s*\{[^}]*max-width\s*:\s*800px/s);
  });

  it(".install-step selector exists", () => {
    expect(css).toMatch(/\.install-step\s*\{/);
  });

  it(".install-step starts with opacity: 0", () => {
    expect(css).toMatch(/\.install-step\s*\{[^}]*opacity\s*:\s*0/s);
  });

  it(".code-block selector exists", () => {
    expect(css).toMatch(/\.code-block\s*\{/);
  });

  it(".code-block includes position: relative", () => {
    expect(css).toMatch(/\.code-block\s*\{[^}]*position\s*:\s*relative/s);
  });

  it(".copy-btn selector exists", () => {
    expect(css).toMatch(/\.copy-btn\s*\{/);
  });

  it(".copy-btn uses position: absolute", () => {
    expect(css).toMatch(/\.copy-btn\s*\{[^}]*position\s*:\s*absolute/s);
  });

  it(".architecture-diagram selector exists", () => {
    expect(css).toMatch(/\.architecture-diagram\s*\{/);
  });

  it(".arch-flow selector exists", () => {
    expect(css).toMatch(/\.arch-flow\s*\{/);
  });

  it(".arch-flow uses display: flex", () => {
    expect(css).toMatch(/\.arch-flow\s*\{[^}]*display\s*:\s*flex/s);
  });

  it(".arch-box selector exists", () => {
    expect(css).toMatch(/\.arch-box\s*\{/);
  });

  it(".arch-box includes min-width: 150px", () => {
    expect(css).toMatch(/\.arch-box\s*\{[^}]*min-width\s*:\s*150px/s);
  });

  it(".cta-content selector exists", () => {
    expect(css).toMatch(/\.cta-content\s*\{/);
  });

  it(".cta-content uses text-align: center", () => {
    expect(css).toMatch(/\.cta-content\s*\{[^}]*text-align\s*:\s*center/s);
  });

  it(".cta-buttons selector exists", () => {
    expect(css).toMatch(/\.cta-buttons\s*\{/);
  });

  it(".cta-buttons uses display: flex", () => {
    expect(css).toMatch(/\.cta-buttons\s*\{[^}]*display\s*:\s*flex/s);
  });
});

// ── Animation Classes ─────────────────────────────────────────────────────────

describe("Animation Classes", () => {
  it(".tech-item.animate-in sets opacity: 1", () => {
    expect(css).toMatch(/\.tech-item\.animate-in\s*\{[^}]*opacity\s*:\s*1/s);
  });

  it(".tech-item.animate-in resets transform to translateY(0)", () => {
    expect(css).toMatch(/\.tech-item\.animate-in\s*\{[^}]*transform\s*:[^}]*translateY\(0\)/s);
  });

  it(".content-block.animate-in sets opacity: 1", () => {
    expect(css).toMatch(/\.content-block\.animate-in\s*\{[^}]*opacity\s*:\s*1/s);
  });

  it(".feature-card.animate-in sets opacity: 1", () => {
    expect(css).toMatch(/\.feature-card\.animate-in\s*\{[^}]*opacity\s*:\s*1/s);
  });

  it(".install-step.animate-in sets opacity: 1", () => {
    expect(css).toMatch(/\.install-step\.animate-in\s*\{[^}]*opacity\s*:\s*1/s);
  });

  it(".install-step.animate-in resets transform to translateX(0)", () => {
    expect(css).toMatch(/\.install-step\.animate-in\s*\{[^}]*transform\s*:[^}]*translateX\(0\)/s);
  });
});

// ── Hover States ──────────────────────────────────────────────────────────────

describe("Hover States", () => {
  it(".tech-item:hover selector exists", () => {
    expect(css).toMatch(/\.tech-item:hover\s*\{/);
  });

  it(".tech-item:hover lifts element with translateY(-4px)", () => {
    expect(css).toMatch(/\.tech-item:hover\s*\{[^}]*transform\s*:[^}]*translateY\(-4px\)/s);
  });

  it(".feature-card:hover selector exists", () => {
    expect(css).toMatch(/\.feature-card:hover\s*\{/);
  });

  it(".feature-card:hover lifts element with translateY(-4px)", () => {
    expect(css).toMatch(/\.feature-card:hover\s*\{[^}]*transform\s*:[^}]*translateY\(-4px\)/s);
  });

  it(".copy-btn:hover selector exists", () => {
    expect(css).toMatch(/\.copy-btn:hover\s*\{/);
  });

  it(".copy-btn:hover sets color to white", () => {
    expect(css).toMatch(/\.copy-btn:hover\s*\{[^}]*color\s*:\s*white/s);
  });
});

// ── Tech Icon Variants ────────────────────────────────────────────────────────

describe("Tech Icon Variants", () => {
  it(".tech-icon.go selector exists with Go blue (#00ADD8)", () => {
    expect(css).toMatch(/\.tech-icon\.go\s*\{[^}]*00ADD8/si);
  });

  it(".tech-icon.sqlite selector exists with dark blue (#003B57)", () => {
    expect(css).toMatch(/\.tech-icon\.sqlite\s*\{[^}]*003B57/si);
  });

  it(".tech-icon.mcp selector exists with purple gradient", () => {
    expect(css).toMatch(/\.tech-icon\.mcp\s*\{[^}]*8b5cf6/si);
  });

  it(".tech-icon.json selector exists with amber gradient (#f59e0b)", () => {
    expect(css).toMatch(/\.tech-icon\.json\s*\{[^}]*f59e0b/si);
  });
});

// ── Architecture Variants ─────────────────────────────────────────────────────

describe("Architecture Variants", () => {
  it(".arch-box.claude uses amber/gold gradient (#f59e0b)", () => {
    expect(css).toMatch(/\.arch-box\.claude\s*\{[^}]*f59e0b/si);
  });

  it(".arch-box.peepee uses netflix-red background", () => {
    expect(css).toMatch(/\.arch-box\.peepee\s*\{[^}]*var\(--netflix-red\)/s);
  });

  it(".arch-box.db uses green gradient (#10b981)", () => {
    expect(css).toMatch(/\.arch-box\.db\s*\{[^}]*10b981/si);
  });
});

// ── Responsive Breakpoints ────────────────────────────────────────────────────

describe("Responsive Breakpoints", () => {
  it("@media (max-width: 768px) breakpoint exists", () => {
    expect(css).toContain("max-width: 768px");
  });

  it("@media (max-width: 375px) breakpoint exists", () => {
    expect(css).toContain("max-width: 375px");
  });

  it("768px breakpoint reduces .project-title font-size to 2.25rem", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/\.project-title\s*\{[^}]*font-size\s*:\s*2\.25rem/s);
  });

  it("768px breakpoint sets tech-grid to 2-column layout", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/\.tech-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\(2,\s*1fr\)/s);
  });

  it("768px breakpoint collapses features-grid to single column", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/\.features-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/s);
  });

  it("768px breakpoint sets arch-flow to flex-direction: column", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/\.arch-flow\s*\{[^}]*flex-direction\s*:\s*column/s);
  });

  it("768px breakpoint stacks .cta-buttons vertically", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/\.cta-buttons\s*\{[^}]*flex-direction\s*:\s*column/s);
  });

  it("375px breakpoint reduces .project-title font-size to 1.85rem", () => {
    const block375 = css.match(/@media\s*\(max-width:\s*375px\)\s*\{([\s\S]*?)$/s);
    expect(block375).not.toBeNull();
    expect(block375[1]).toMatch(/\.project-title\s*\{[^}]*font-size\s*:\s*1\.85rem/s);
  });

  it("375px breakpoint sets tech-grid to 1fr 1fr columns", () => {
    const block375 = css.match(/@media\s*\(max-width:\s*375px\)\s*\{([\s\S]*?)$/s);
    expect(block375).not.toBeNull();
    expect(block375[1]).toMatch(/\.tech-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr\s+1fr/s);
  });
});

// ── Color / Property Values ───────────────────────────────────────────────────

describe("Color and Property Values", () => {
  it(".project-badge-large uses var(--netflix-red) background", () => {
    expect(css).toMatch(/\.project-badge-large\s*\{[^}]*background\s*:\s*var\(--netflix-red\)/s);
  });

  it(".solution-list li::before uses green (#10b981)", () => {
    expect(css).toMatch(/\.solution-list\s+li::before\s*\{[^}]*10b981/si);
  });

  it(".problem-list li::before uses var(--netflix-red)", () => {
    expect(css).toMatch(/\.problem-list\s+li::before\s*\{[^}]*var\(--netflix-red\)/s);
  });

  it(".code-block code uses light text color (#e2e8f0)", () => {
    expect(css).toMatch(/\.code-block\s+code\s*\{[^}]*e2e8f0/si);
  });
});

// ── Layout Properties ─────────────────────────────────────────────────────────

describe("Layout Properties", () => {
  it(".project-hero has padding: 140px 24px 80px", () => {
    expect(css).toMatch(/\.project-hero\s*\{[^}]*padding\s*:\s*140px\s+24px\s+80px/s);
  });

  it(".project-cta-section has padding: 100px 24px", () => {
    expect(css).toMatch(/\.project-cta-section\s*\{[^}]*padding\s*:\s*100px\s+24px/s);
  });

  it(".feature-card has padding: 32px", () => {
    expect(css).toMatch(/\.feature-card\s*\{[^}]*padding\s*:\s*32px/s);
  });

  it(".tech-grid has gap: 24px", () => {
    expect(css).toMatch(/\.tech-grid\s*\{[^}]*gap\s*:\s*24px/s);
  });
});

// ── Animation Delay Staggering ────────────────────────────────────────────────

describe("Animation Delay Staggering", () => {
  it(".tech-item:nth-child(1) has a transition-delay", () => {
    expect(css).toMatch(/\.tech-item:nth-child\(1\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".tech-item:nth-child(2) has a transition-delay", () => {
    expect(css).toMatch(/\.tech-item:nth-child\(2\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".tech-item:nth-child(3) has a transition-delay", () => {
    expect(css).toMatch(/\.tech-item:nth-child\(3\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".tech-item:nth-child(4) has a transition-delay", () => {
    expect(css).toMatch(/\.tech-item:nth-child\(4\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".feature-card:nth-child(1) has a transition-delay", () => {
    expect(css).toMatch(/\.feature-card:nth-child\(1\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".feature-card:nth-child(3) has a transition-delay", () => {
    expect(css).toMatch(/\.feature-card:nth-child\(3\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".install-step:nth-child(1) has a transition-delay", () => {
    expect(css).toMatch(/\.install-step:nth-child\(1\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".install-step:nth-child(2) has a transition-delay", () => {
    expect(css).toMatch(/\.install-step:nth-child\(2\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".content-block:nth-child(1) has a transition-delay", () => {
    expect(css).toMatch(/\.content-block:nth-child\(1\)\s*\{[^}]*transition-delay\s*:/s);
  });

  it(".content-block:nth-child(2) has a transition-delay", () => {
    expect(css).toMatch(/\.content-block:nth-child\(2\)\s*\{[^}]*transition-delay\s*:/s);
  });
});

// ── Back-Link and Install Step Hover ─────────────────────────────────────────

describe("Back-Link and Section Details", () => {
  it(".back-link:hover selector exists with color change to netflix-red", () => {
    expect(css).toMatch(/\.back-link:hover\s*\{[^}]*color\s*:\s*var\(--netflix-red\)/s);
  });

  it(".install-step uses translateX(-20px) as initial transform", () => {
    expect(css).toMatch(/\.install-step\s*\{[^}]*transform\s*:[^}]*translateX\(-20px\)/s);
  });

  it(".step-number uses netflix-red background", () => {
    expect(css).toMatch(/\.step-number\s*\{[^}]*background\s*:\s*var\(--netflix-red\)/s);
  });

  it(".project-tech-section has padding: 80px 24px", () => {
    expect(css).toMatch(/\.project-tech-section\s*\{[^}]*padding\s*:\s*80px\s+24px/s);
  });

  it("768px breakpoint reduces section padding to 60px for project sections", () => {
    const block768 = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)(?=@media|\s*$)/);
    expect(block768).not.toBeNull();
    expect(block768[1]).toMatch(/padding\s*:\s*60px/);
  });
});
