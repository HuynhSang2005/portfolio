import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Separator from "@/components/layout/separator";

describe("layout Separator", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders dashed band with ring chrome", () => {
    const { container } = render(<Separator />);
    const band = container.querySelector(".bg-dashed");
    expect(band).toBeInTheDocument();
    expect(band?.className).toContain("h-8");
    expect(band?.className).toContain("ring-[0.65px]");
    expect(band?.className).toContain("ring-foreground/10");
  });

  it("merges custom className onto the band", () => {
    const { container } = render(<Separator className="custom-band" />);
    const band = container.querySelector(".bg-dashed");
    expect(band?.className).toContain("custom-band");
  });
});
