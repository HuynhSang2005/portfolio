"use client";

import { useEffect, useState } from "react";

/**
 * Hook hiển thị thời gian hiện tại theo định dạng `en-US` (giờ 12h, h:m:s).
 *
 * Cập nhật mỗi giây sau khi mount. Trả về chuỗi rỗng trước mount để tránh hydration mismatch.
 *
 * @returns Chuỗi thời gian định dạng `en-US` hour12; `""` trong SSR và lần render đầu.
 */
export function useTime(): string {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return "";
  }

  return time;
}
