import { describe, expect, it } from "vitest";

import { getNextTheme } from "@/components/layout/mode-toggle";

describe("getNextTheme", () => {
  it("switches dark -> light", () => {
    expect(getNextTheme("dark")).toBe("light");
  });

  it("switches light -> dark", () => {
    expect(getNextTheme("light")).toBe("dark");
  });

  it("treats undefined/system-unresolved as light -> dark", () => {
    expect(getNextTheme(undefined)).toBe("dark");
  });
});

describe("view transition fallback", () => {
  it("applies the theme exactly once when startViewTransition is missing", async () => {
    const { applyThemeTransition } = await import("@/components/layout/mode-toggle");
    let calls = 0;
    const switchTheme = () => {
      calls += 1;
    };
    // jsdom has no document.startViewTransition
    applyThemeTransition(switchTheme);
    expect(calls).toBe(1);
  });
});
