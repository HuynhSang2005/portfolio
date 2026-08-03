import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Info from "@/features/home/components/info";

describe("Info overlays", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  function setViewport(width: number, height: number) {
    Object.defineProperty(window, "innerWidth", {
      value: width,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: height,
      writable: true,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }

  it("renders nothing below 1000px viewport width", () => {
    const { container } = render(<Info show={["time", "screen"]} />);
    act(() => setViewport(999, 800));
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(container.firstChild).toBeNull();
  });

  it("renders screen size overlay at >= 1000px", () => {
    render(<Info show={["time", "screen"]} />);
    act(() => setViewport(1440, 900));
    expect(screen.getByText("1440 x 900")).toBeTruthy();
  });

  it("does not render llms links in P2", () => {
    render(<Info show={["time", "screen"]} />);
    act(() => setViewport(1440, 900));
    expect(screen.queryByText("llms.txt")).toBeNull();
    expect(screen.queryByText("llms-full.txt")).toBeNull();
  });
});
