"use client";

import { useTheme } from "@wrksz/themes/client";
import { useCallback, useMemo } from "react";

import { META_THEME_COLORS } from "@/config/site";

/**
 * Hook đồng bộ `meta[name="theme-color"]` với theme đang resolve.
 *
 * @returns Màu meta hiện tại và hàm cập nhật trực tiếp thẻ meta.
 */
export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = useMemo(
    () => (resolvedTheme !== "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark),
    [resolvedTheme],
  );

  const setMetaColor = useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, []);

  return { metaColor, setMetaColor };
}
