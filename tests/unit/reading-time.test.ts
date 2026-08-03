import { describe, expect, it } from "vitest";

import { computeReadTime } from "@/lib/reading-time";

describe("computeReadTime", () => {
  it("formats as 'N min read'", () => {
    expect(computeReadTime("hello world")).toBe("1 min read");
  });

  it("rounds up at 238 wpm", () => {
    const words = Array.from({ length: 239 }, (_, i) => `w${i}`).join(" ");
    expect(computeReadTime(words)).toBe("2 min read");
    const exact = Array.from({ length: 238 }, (_, i) => `w${i}`).join(" ");
    expect(computeReadTime(exact)).toBe("1 min read");
  });

  it("strips markdown code fences and punctuation-only tokens", () => {
    const content = "```ts\nconst a = 1;\n```\n" + "word ".repeat(500);
    expect(computeReadTime(content)).toBe("3 min read");
  });
});
