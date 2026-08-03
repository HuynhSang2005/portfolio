"use client";

import { type TargetAndTransition, type Transition, motion } from "motion/react";

import { useTime } from "@/lib/hooks/use-time";
import { useWindowSize } from "@/lib/hooks/use-window-size";
import { cn } from "@/lib/utils";

const fadeIn: {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
} = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

/** Loại overlay hiển thị trên góc màn hình desktop. */
type InfoOverlay = "time" | "screen";

/**
 * Overlay thông tin cố định (thời gian, kích thước màn hình) — chỉ hiển thị khi viewport ≥ 1000px.
 *
 * @param show - Danh sách overlay cần render (`"time"`, `"screen"`).
 */
export default function Info({ show }: { show: InfoOverlay[] }) {
  const { width } = useWindowSize();

  if (width < 1000) {
    return null;
  }

  return (
    <>
      {show.includes("time") && <Time className="top-4 left-4" />}
      {show.includes("screen") && <ScreenSize className="bottom-4 left-4" />}
    </>
  );
}

/**
 * Overlay thời gian góc trên-trái — cập nhật mỗi giây, fade-in từ trái.
 */
export function Time({ className }: { className?: string }) {
  const time = useTime();

  return (
    <motion.div
      className={cn(
        "fixed top-4 left-4 z-50 font-x text-gray-600 text-xs tracking-wider dark:text-gray-300",
        className,
      )}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      {time}
    </motion.div>
  );
}

/**
 * Overlay kích thước màn hình góc dưới-trái — cập nhật khi resize, fade-in từ trái.
 */
export function ScreenSize({ className }: { className?: string }) {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      className={cn(
        "fixed bottom-4 left-4 z-50 font-x text-gray-600 text-xs tracking-wider dark:text-gray-300",
        className,
      )}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      {width} x {height}
    </motion.div>
  );
}
