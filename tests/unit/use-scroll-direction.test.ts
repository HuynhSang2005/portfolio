import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SCROLL_AREA_ID } from "@/config/site";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

function createScrollArea() {
  const el = document.createElement("div");
  el.id = SCROLL_AREA_ID;
  document.body.appendChild(el);
  return el;
}

function scrollTo(el: HTMLElement, top: number) {
  Object.defineProperty(el, "scrollTop", { value: top, writable: true, configurable: true });
  el.dispatchEvent(new Event("scroll"));
}

describe("useScrollDirection", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = createScrollArea();
  });

  afterEach(() => {
    el.remove();
  });

  it("starts at top, direction down, not visible", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toEqual({ scrollTop: 0, direction: "down", visible: false });
  });

  it("reports direction down then up as scroll position changes", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => scrollTo(el, 500));
    expect(result.current.direction).toBe("down");
    expect(result.current.visible).toBe(true);
    act(() => scrollTo(el, 200));
    expect(result.current.direction).toBe("up");
    expect(result.current.scrollTop).toBe(200);
  });

  it("visible is false below the 400 threshold", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => scrollTo(el, 399));
    expect(result.current.visible).toBe(false);
    act(() => scrollTo(el, 400));
    expect(result.current.visible).toBe(true);
  });
});
