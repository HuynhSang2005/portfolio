import { describe, expect, it } from "vitest";

import { META_THEME_COLORS, SCROLL_AREA_ID, siteConfig, siteConfigSchema } from "@/config/site";

describe("siteConfig", () => {
  it("passes its own Zod schema", () => {
    expect(() => siteConfigSchema.parse(siteConfig)).not.toThrow();
  });

  it("uses the owner identity and no template-author info", () => {
    expect(siteConfig.name).toBe("Huỳnh Sang");
    const serialized = JSON.stringify(siteConfig).toLowerCase();
    for (const banned of ["ruixen", "srisomanaath", "somanaath"]) {
      expect(serialized).not.toContain(banned);
    }
  });

  it("navbar hrefs are internal paths", () => {
    for (const item of siteConfig.navbar) {
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("exposes template constants verbatim", () => {
    expect(SCROLL_AREA_ID).toBe("scroll-area-id");
    expect(META_THEME_COLORS).toEqual({ light: "#ffffff", dark: "#09090b" });
  });

  it("rejects invalid config shapes", () => {
    expect(siteConfigSchema.safeParse({ name: "" }).success).toBe(false);
    expect(
      siteConfigSchema.safeParse({
        ...siteConfig,
        navbar: [{ href: "https://x.com", label: "Bad", icon: "home" }],
      }).success,
    ).toBe(false);
  });
});
