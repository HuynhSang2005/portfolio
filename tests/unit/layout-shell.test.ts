import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const layoutPath = join(process.cwd(), "src/app/layout.tsx");
const layout = readFileSync(layoutPath, "utf8");

describe("root layout shell", () => {
  it("exports viewport with light meta theme color", () => {
    expect(layout).toContain("export const viewport");
    expect(layout).toContain("themeColor: META_THEME_COLORS.light");
    expect(layout).toContain('width: "device-width"');
    expect(layout).toContain("initialScale: 1");
  });

  it("exports brand metadata with metadataBase and title template", () => {
    expect(layout).toContain("metadataBase: new URL(SITE_URL)");
    expect(layout).toContain("template:");
    expect(layout).toContain("description: siteConfig.description");
  });

  it("defines root shell structure per brief", () => {
    expect(layout).toContain("suppressHydrationWarning");
    expect(layout).toContain("fontX.variable");
    expect(layout).toContain("fontMono.variable");
    expect(layout).toContain("scroll-smooth");
    expect(layout).toContain("os-macos");
    expect(layout).toContain('id="main-content"');
    expect(layout).toContain("vaul-drawer-wrapper");
    expect(layout).toContain("bg-background");
    expect(layout).toContain("<Navigation");
    expect(layout).toContain("<Providers");
  });

  it("hosts async ThemeProvider from @wrksz/themes/next in RSC layout", () => {
    expect(layout).toMatch(/import\s*\{\s*ThemeProvider\s*\}\s*from\s*"@wrksz\/themes\/next"/);
    expect(layout).toMatch(/<ThemeProvider[\s>]/);
    const providers = readFileSync(join(process.cwd(), "src/app/providers.tsx"), "utf8");
    expect(providers).toContain('"use client"');
    expect(providers).not.toMatch(/from\s*"@wrksz\/themes\/next"/);
    expect(providers).not.toMatch(/<ThemeProvider[\s>]/);
  });
});
