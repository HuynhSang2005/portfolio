import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/layout/dock", () => ({
  default: ({ className }: { className: string }) => (
    <div data-testid="bottom-dock" className={className} />
  ),
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

import Navigation from "@/components/layout/navigation";

describe("Navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders BottomDock with desktop-only visibility class", () => {
    render(<Navigation />);
    const dock = screen.getByTestId("bottom-dock");
    expect(dock).toHaveClass("hidden", "lg:block");
  });

  it("renders ScrollTop", () => {
    render(<Navigation />);
    expect(screen.getByRole("button", { name: /scroll to top/i })).toBeInTheDocument();
  });
});
