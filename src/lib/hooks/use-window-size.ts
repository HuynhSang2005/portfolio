"use client";

import { useEffect, useState } from "react";

/** Kích thước viewport hiện tại (px). */
export type WindowSize = {
  width: number;
  height: number;
};

/**
 * Hook theo dõi kích thước viewport qua sự kiện `resize`.
 *
 * Trả về `{0, 0}` trước mount để tránh hydration mismatch khi đọc `window`.
 *
 * @returns `{ width, height }` — `{0, 0}` trong SSR và lần render đầu.
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
