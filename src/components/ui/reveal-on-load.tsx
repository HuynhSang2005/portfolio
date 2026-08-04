"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Props cho {@link RevealOnLoad}. */
interface RevealOnLoadProps {
  children: ReactNode;
  /** Độ trễ trước khi bắt đầu animation (giây). */
  delay?: number;
  /** Thời lượng animation (giây). */
  duration?: number;
  className?: string;
  /** Hướng offset ban đầu trước khi reveal (mặc định `up`, 20px). */
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Wrapper motion reveal khi mount — fade + slide 20px theo `direction`.
 * Ease mặc định `[0.25, 0.4, 0.25, 1]` (template parity).
 */
export function RevealOnLoad({
  children,
  delay = 0,
  duration = 0.6,
  className,
  direction = "up",
}: RevealOnLoadProps) {
  const reduceMotion = useReducedMotion();

  const directionOffset = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  };

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              ...directionOffset[direction],
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
