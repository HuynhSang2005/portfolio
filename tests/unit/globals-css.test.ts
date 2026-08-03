import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("globals.css", () => {
  it("imports the base-nova preset and typography plugin", () => {
    expect(globalsCss).toContain('@import "shadcn/tailwind.css"');
    expect(globalsCss).toContain('@plugin "@tailwindcss/typography"');
  });

  it("maps sans typography to the X font family", () => {
    expect(globalsCss).toContain("--font-sans: var(--font-x)");
  });

  it("exposes template layout and scroll utilities", () => {
    for (const utility of [
      "scrollable-area",
      "layout",
      "content-wrapper",
      "content",
      "mask-gradient",
      "bg-dashed",
      "screen-line-before",
      "screen-line-after",
      "no-scrollbar",
      "link",
      "step",
      "thumbnail-shadow",
      "horizontal-scroll-area",
    ]) {
      expect(globalsCss).toContain(`@utility ${utility}`);
    }
  });

  it("keeps only the required animate utilities and a single reveal keyframe", () => {
    expect(globalsCss).toContain(".animate-reveal");
    expect(globalsCss).toContain(".animate-marquee");
    expect(globalsCss).toContain(".animate-marquee-vertical");
    expect(globalsCss.match(/@keyframes reveal\s*\{/g)?.length).toBe(1);
  });

  it("keeps code color tokens without the rehype pretty-code component block", () => {
    expect(globalsCss).toContain("--color-code:");
    expect(globalsCss).not.toContain("[data-rehype-pretty-code-figure]");
  });
});
