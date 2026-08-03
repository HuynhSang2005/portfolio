"use client";

import { useEffect, useState } from "react";

import { SCROLL_AREA_ID } from "@/config/site";

/** Trạng thái scroll: vị trí, hướng và hiển thị nút scroll-top. */
export type ScrollDirectionState = {
  scrollTop: number;
  direction: "up" | "down";
  visible: boolean;
};

const VISIBLE_THRESHOLD = 400;

/**
 * Hook theo dõi hướng scroll và ngưỡng hiển thị trên vùng scroll chính.
 *
 * Đọc `#SCROLL_AREA_ID` nếu có trong DOM; fallback `window` khi không tìm thấy.
 *
 * @returns Trạng thái scroll hiện tại — `visible` là `true` khi `scrollTop >= 400`.
 */
export function useScrollDirection(): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    scrollTop: 0,
    direction: "down",
    visible: false,
  });

  useEffect(() => {
    const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        scrollAreaElem instanceof HTMLElement ? scrollAreaElem.scrollTop : window.scrollY;
      setState({
        scrollTop,
        direction: scrollTop - lastScrollTop > 0 ? "down" : "up",
        visible: scrollTop >= VISIBLE_THRESHOLD,
      });
      lastScrollTop = scrollTop;
    };

    const target: HTMLElement | Window =
      scrollAreaElem instanceof HTMLElement ? scrollAreaElem : window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return state;
}
