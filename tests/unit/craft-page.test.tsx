import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/craft",
}));

vi.mock("@wrksz/themes/client", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

vi.mock("@/components/mdx/mdx", () => ({
  MDX: ({ html }: { html: string }) => <article data-testid="mdx-body">{html}</article>,
}));

import CraftPage, { generateMetadata as indexMetadata } from "@/app/craft/page";
import CraftPostPage, { generateStaticParams } from "@/app/craft/[slug]/page";
import { getAllCraftPosts } from "@/features/craft/data/posts";

function renderWithProviders(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  vi.stubGlobal(
    "HTMLMediaElement",
    class {
      load = vi.fn();
      play = vi.fn();
      pause = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      readyState = 4;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("craft index", () => {
  it("renders heading Craft and at least one card title", async () => {
    const posts = await getAllCraftPosts();
    renderWithProviders(await CraftPage());
    expect(screen.getByRole("heading", { level: 1, name: "Craft" })).toBeTruthy();
    expect(screen.getByText(posts[0]!.metadata.title)).toBeTruthy();
  });

  it("exposes metadata", async () => {
    const metadata = await indexMetadata();
    expect(metadata.title).toBe("Craft");
  });
});

describe("craft article", () => {
  it("generates static params for all published posts", async () => {
    const posts = await getAllCraftPosts();
    const params = await generateStaticParams();
    expect(params.map((p) => p.slug).sort()).toEqual(posts.map((p) => p.slug).sort());
  });

  it("renders title, date and body", async () => {
    const posts = await getAllCraftPosts();
    const slug = posts[0]!.slug;
    const params = Promise.resolve({ slug });
    renderWithProviders(await CraftPostPage({ params }));
    expect(screen.getByRole("heading", { level: 1, name: posts[0]!.metadata.title })).toBeTruthy();
    expect(screen.getByText("Back to craft")).toBeTruthy();
  });
});
