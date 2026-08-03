import { describe, expect, it } from "vitest";

import { getAllBlogPosts, getBlogPostBySlug } from "@/features/blog/data/posts";
import { frontmatterSchema } from "@/features/blog/types/post";

describe("blog posts data layer", () => {
  it("returns published posts sorted by date desc", async () => {
    const posts = await getAllBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
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
    const posts = await getAllBlogPosts();
    for (const post of posts) {
      expect(() => frontmatterSchema.parse(post.metadata)).not.toThrow();
    }
  });

  it("uses the frontmatter readTime when present", async () => {
    const one = await getBlogPostBySlug("sample-post-one");
    expect(one?.metadata.readTime).toBe("4 min read");
  });

  it("computes readTime when absent from frontmatter", async () => {
    const two = await getBlogPostBySlug("sample-post-two");
    expect(two?.metadata.readTime).toMatch(/^\d+ min read$/);
  });

  it("returns undefined for unknown slugs", async () => {
    await expect(getBlogPostBySlug("does-not-exist")).resolves.toBeUndefined();
  });

  it("rejects invalid frontmatter shapes", () => {
    expect(frontmatterSchema.safeParse({ title: "x" }).success).toBe(false);
  });
});
