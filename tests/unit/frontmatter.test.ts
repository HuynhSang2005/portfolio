import { describe, expect, it } from "vitest";

import { parseFrontmatter } from "@/features/blog/lib/frontmatter";

describe("parseFrontmatter", () => {
  it("parses yaml frontmatter and returns the body", () => {
    const { data, content } = parseFrontmatter(
      "---\ntitle: Hello\npublished: true\n---\nBody text",
    );
    expect(data).toEqual({ title: "Hello", published: true });
    expect(content).toBe("Body text");
  });

  it("returns empty data when no frontmatter is present", () => {
    const { data, content } = parseFrontmatter("Just content");
    expect(data).toEqual({});
    expect(content).toBe("Just content");
  });

  it("tolerates empty frontmatter blocks", () => {
    const { data, content } = parseFrontmatter("---\n---\nBody");
    expect(data).toEqual({});
    expect(content).toBe("Body");
  });
});
