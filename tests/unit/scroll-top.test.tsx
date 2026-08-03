import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SCROLL_AREA_ID } from "@/config/site";

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

import { ScrollTop } from "@/components/layout/scroll-top";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

describe("ScrollTop", () => {
  afterEach(() => {
    cleanup();
    document.getElementById(SCROLL_AREA_ID)?.remove();
  });

  it("consumes useScrollDirection for visibility and direction", () => {
    vi.mocked(useScrollDirection).mockReturnValue({
      scrollTop: 500,
      direction: "up",
      visible: true,
    });
    render(<ScrollTop />);
    const btn = screen.getByRole("button", { name: /scroll to top/i });
    expect(btn).toHaveAttribute("data-visible", "true");
    expect(btn).toHaveAttribute("data-scroll-direction", "up");
  });

  it("scrolls scroll area to top on click", () => {
    const el = document.createElement("div");
    el.id = SCROLL_AREA_ID;
    el.scrollTo = vi.fn();
    document.body.appendChild(el);

    render(<ScrollTop />);
    fireEvent.click(screen.getByRole("button", { name: /scroll to top/i }));

    expect(el.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
