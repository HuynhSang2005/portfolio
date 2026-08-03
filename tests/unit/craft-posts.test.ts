import fs from "node:fs";

import { describe, expect, it } from "vitest";

import { getAllCraftPosts, getCraftPostBySlug } from "@/features/craft/data/posts";
import { frontmatterSchema } from "@/features/craft/types/post";

const CONTENT_DIR = "src/features/craft/content";

describe("craft posts data layer", () => {
  it("returns published posts sorted by date desc", async () => {
    const posts = await getAllCraftPosts();
    expect(posts.length).toBe(15);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1]!.metadata.date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i]!.metadata.date).getTime(),
      );
    }
    for (const post of posts) {
      expect(post.metadata.published).toBe(true);
    }
  });

  it("validates frontmatter against the schema", async () => {
    const posts = await getAllCraftPosts();
    for (const post of posts) {
      expect(() => frontmatterSchema.parse(post.metadata)).not.toThrow();
    }
  });

  it("returns undefined for unknown slugs", async () => {
    await expect(getCraftPostBySlug("does-not-exist")).resolves.toBeUndefined();
  });

  it("looks up a known slug", async () => {
    const post = await getCraftPostBySlug("hero-bars");
    expect(post?.slug).toBe("hero-bars");
    expect(post?.metadata.title.length).toBeGreaterThan(0);
  });

  it("scrubbed content has no pro.ruixen.com or SriSomanaath", async () => {
    const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));
    for (const file of files) {
      const raw = fs.readFileSync(`${CONTENT_DIR}/${file}`, "utf-8");
      expect(raw).not.toMatch(/pro\.ruixen\.com/i);
      expect(raw).not.toMatch(/SriSomanaath/i);
      expect(raw).not.toMatch(/^author:/m);
      expect(raw).not.toMatch(/^href:/m);
    }
  });
});
