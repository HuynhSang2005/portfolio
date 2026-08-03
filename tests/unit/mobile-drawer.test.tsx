import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const useMounted = vi.fn(() => true);

vi.mock("@/lib/hooks/use-mounted", () => ({
  useMounted: () => useMounted(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

import { MobileDrawer } from "@/components/layout/mobile-drawer";

describe("MobileDrawer", () => {
  beforeEach(() => {
    useMounted.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders navbar links from siteConfig when drawer is open", () => {
    render(<MobileDrawer />);
    fireEvent.click(screen.getByTitle("Toggle drawer"));
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Craft")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("shows placeholder trigger before client mount", () => {
    useMounted.mockReturnValue(false);
    render(<MobileDrawer />);
    expect(screen.getByTitle("Toggle drawer")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("omits social section when siteConfig.socials is empty", () => {
    render(<MobileDrawer />);
    fireEvent.click(screen.getByTitle("Toggle drawer"));
    expect(screen.queryByText("Social")).not.toBeInTheDocument();
  });
});
