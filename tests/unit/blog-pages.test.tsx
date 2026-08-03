import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

vi.mock("@/components/mdx/mdx", () => ({
  MDX: ({ code }: { code: string }) => <article data-testid="mdx-body">{code}</article>,
}));

import BlogPage, { generateMetadata as indexMetadata } from "@/app/blog/page";
import BlogPostPage, { generateStaticParams } from "@/app/blog/[slug]/page";
import { getAllBlogPosts } from "@/features/blog/data/posts";

afterEach(() => {
  cleanup();
});

describe("blog index", () => {
  it("renders a row per published post with metadata cluster", async () => {
    const posts = await getAllBlogPosts();
    render(await BlogPage());
    for (const post of posts) {
      expect(screen.getByRole("link", { name: new RegExp(post.metadata.title) })).toBeTruthy();
      expect(screen.getAllByText(post.metadata.category).length).toBeGreaterThan(0);
    }
  });

  it("exposes metadata", async () => {
    const metadata = await indexMetadata();
    expect(metadata.title).toBe("Blog");
  });
});

describe("blog article", () => {
  it("generates static params for all published posts", async () => {
    const posts = await getAllBlogPosts();
    const params = await generateStaticParams();
    expect(params.map((p) => p.slug).sort()).toEqual(posts.map((p) => p.slug).sort());
  });

  it("renders title, metadata row, lead and body", async () => {
    const posts = await getAllBlogPosts();
    const slug = posts[0]!.slug;
    const params = Promise.resolve({ slug });
    render(await BlogPostPage({ params }));
    expect(screen.getByRole("heading", { level: 1, name: posts[0]!.metadata.title })).toBeTruthy();
    expect(screen.getByText(posts[0]!.metadata.readTime)).toBeTruthy();
  }, 20_000);
});
