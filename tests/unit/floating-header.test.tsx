import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const usePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

vi.mock("@/lib/hooks/use-scroll-direction", () => ({
  useScrollDirection: vi.fn(() => ({
    scrollTop: 0,
    direction: "down",
    visible: false,
  })),
}));

import { FloatingHeader } from "@/components/layout/floating-header";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

describe("FloatingHeader", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/");
  });

  afterEach(() => {
    cleanup();
  });

  it("shows MobileDrawer trigger on root path", () => {
    render(<FloatingHeader />);
    expect(screen.getByTitle("Toggle drawer")).toBeInTheDocument();
  });

  it("shows back button on nested path", () => {
    usePathname.mockReturnValue("/blog/post");
    render(<FloatingHeader />);
    expect(screen.queryByTitle("Toggle drawer")).not.toBeInTheDocument();
    expect(screen.getByTitle("Go back")).toBeInTheDocument();
  });

  it("renders scrollTitle driven by useScrollDirection scrollTop", () => {
    vi.mocked(useScrollDirection).mockReturnValue({
      scrollTop: 50,
      direction: "down",
      visible: false,
    });
    render(<FloatingHeader scrollTitle="Test Title" />);
    const title = screen.getByText("Test Title");
    expect(title).toHaveStyle({ transform: "translateY(50%)" });
  });
});
