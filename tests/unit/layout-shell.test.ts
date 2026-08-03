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

  it("exports Huỳnh Sang metadata", () => {
    expect(layout).toContain('title: "Huỳnh Sang"');
    expect(layout).toContain('description: "Personal portfolio"');
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
});
