import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MDX } from "@/components/mdx/mdx";

describe("MDX HTML renderer", () => {
  it("renders precompiled HTML into an article", () => {
    const { container } = render(
      <MDX html={'<h2 id="hello-world">Hello World</h2><p>Use <code>cn()</code>.</p>'} />,
    );
    expect(container.querySelector("article.mdx-content")).toBeTruthy();
    expect(container.querySelector("h2")?.id).toBe("hello-world");
    expect(container.querySelector("code")?.textContent).toBe("cn()");
  });

  it("applies className on the article", () => {
    const { container } = render(<MDX html="<p>hi</p>" className="prose" />);
    expect(container.querySelector("article")?.className).toContain("prose");
  });
});
