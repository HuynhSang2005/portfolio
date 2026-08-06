import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  JetBrains_Mono: () => ({ variable: "--font-mono" }),
}));

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "--font-x" }),
}));

import { fontMono, fontX } from "@/lib/fonts";

describe("fonts", () => {
  it("exports fontX and fontMono with CSS variable class names", () => {
    expect(fontX.variable).toBe("--font-x");
    expect(fontMono.variable).toBe("--font-mono");
  });

  it("ships X font assets in public/assets", () => {
    const publicDir = join(process.cwd(), "public/assets");
    for (const name of ["X-Regular.woff2", "X-Medium.woff2"]) {
      expect(existsSync(join(publicDir, name))).toBe(true);
    }
  });

  it("matches byte-identical X fonts when the local template checkout exists", () => {
    const templateDir = join(
      process.cwd(),
      "portfolio-template-ui-ux/portfolio-main/apps/website/public/assets",
    );
    // Template tree is local-only (gitignored) — skip on CI clones.
    if (!existsSync(templateDir)) {
      return;
    }

    const publicDir = join(process.cwd(), "public/assets");
    for (const name of ["X-Regular.woff2", "X-Medium.woff2"]) {
      const templateBytes = readFileSync(join(templateDir, name));
      const publicBytes = readFileSync(join(publicDir, name));
      expect(publicBytes.equals(templateBytes)).toBe(true);
    }
  });
});
