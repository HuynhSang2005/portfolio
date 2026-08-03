import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("@wrksz/themes/client", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
}));

import BottomDock from "@/components/layout/dock";
import { UiStoreProvider } from "@/providers/ui-store-provider";

function renderDock() {
  return render(
    <UiStoreProvider>
      <BottomDock className="test-class" />
    </UiStoreProvider>,
  );
}

describe("BottomDock autohide (defect fix #1)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("arms autohide timer on mount", () => {
    const spy = vi.spyOn(globalThis, "setTimeout");
    renderDock();
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("hides dock after 5s idle", () => {
    const { container } = renderDock();
    const footer = container.querySelector("footer");
    expect(footer?.className).not.toContain("-bottom-18");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(footer?.className).toContain("-bottom-18");
  });

  it("shows dock on mouse enter and cancels pending hide", () => {
    const { container } = renderDock();
    const wrapper = container.firstChild as HTMLElement;
    const footer = container.querySelector("footer")!;

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(footer.className).toContain("-bottom-18");

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    expect(footer.className).not.toContain("-bottom-18");
  });

  it("re-arms timer on mouse leave", () => {
    const spy = vi.spyOn(globalThis, "setTimeout");
    const { container } = renderDock();
    const wrapper = container.firstChild as HTMLElement;

    spy.mockClear();
    act(() => {
      fireEvent.mouseLeave(wrapper);
    });
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });
});

describe("BottomDock content", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders navbar links from siteConfig", () => {
    const { container } = renderDock();
    const footer = container.querySelector("footer")!;
    const links = within(footer).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/craft");
    expect(links[2]).toHaveAttribute("href", "/blog");
    expect(links[3]).toHaveAttribute("href", "/contact");
  });

  it("renders SoundToggle and ModeToggle in dock", () => {
    const { container } = renderDock();
    const footer = container.querySelector("footer")!;
    expect(within(footer).getByLabelText("Mute sounds")).toBeInTheDocument();
    expect(footer.querySelector("svg[viewBox='0 0 100 100']")).toBeInTheDocument();
  });

  it("omits social icons when siteConfig.socials is empty", () => {
    const { container } = renderDock();
    const footer = container.querySelector("footer")!;
    expect(within(footer).queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });
});
