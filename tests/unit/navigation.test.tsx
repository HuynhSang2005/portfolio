import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/layout/dock", () => ({
  default: ({ className }: { className: string }) => (
    <div data-testid="bottom-dock" className={className} />
  ),
}));

import Navigation from "@/components/layout/navigation";

describe("Navigation", () => {
  it("renders BottomDock with desktop-only visibility class", () => {
    render(<Navigation />);
    const dock = screen.getByTestId("bottom-dock");
    expect(dock).toHaveClass("hidden", "lg:block");
  });
});
