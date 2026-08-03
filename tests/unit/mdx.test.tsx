import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MDX } from "@/components/mdx/mdx";

describe("MDX pipeline", () => {
  it("renders headings with rehype-slug ids and anchor icons", async () => {
    const ui = await MDX({ code: "## Hello World" });
    const { container } = render(ui);
    const heading = container.querySelector("h2")!;
    expect(heading.id).toBe("hello-world");
    expect(heading.querySelector('a[href="#hello-world"]')).toBeTruthy();
  }, 30_000);

  it("renders code blocks with title figcaption and copy button", async () => {
    const code = '```ts title="app.ts"\nconst a = 1;\n```';
    const ui = await MDX({ code });
    const { container } = render(ui);
    expect(container.querySelector("[data-rehype-pretty-code-figure]")).toBeTruthy();
    expect(container.querySelector("figcaption")?.textContent).toContain("app.ts");
    expect(screen.getByRole("button", { name: /copy/i })).toBeTruthy();
  }, 30_000);

  it("renders inline code as a pill", async () => {
    const ui = await MDX({ code: "Use `cn()` here." });
    const { container } = render(ui);
    expect(container.querySelector("code")!.className).toContain("rounded-md");
  }, 30_000);

  it("opens external links in a new tab with rel", async () => {
    const ui = await MDX({ code: "[docs](https://nextjs.org/docs)" });
    const { container } = render(ui);
    const link = container.querySelector("a")!;
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  }, 30_000);

  it("renders GFM tables via the Table mapping", async () => {
    const ui = await MDX({ code: "| A |\n| --- |\n| 1 |" });
    const { container } = render(ui);
    expect(container.querySelector('[data-slot="table-container"]')).toBeTruthy();
  }, 30_000);
});
