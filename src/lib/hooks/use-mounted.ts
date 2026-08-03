"use client";

import { useEffect, useState } from "react";

/**
 * Hook theo dõi mount phía client — tránh hydration mismatch khi render phụ thuộc DOM.
 *
 * @returns `true` sau khi component đã mount trên client; `false` trong SSR và lần render đầu.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
