"use client";

import { useTheme } from "@wrksz/themes/client";
import { type Variants, motion as m } from "motion/react";
import { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/lib/hooks/use-meta-color";
import { useSound } from "@/lib/hooks/use-sound";

/**
 * Trả về theme kế tiếp khi người dùng bấm toggle (dark ↔ light).
 *
 * @param resolvedTheme - Theme đã resolve từ `@wrksz/themes`; `undefined` được coi là light.
 */
export function getNextTheme(resolvedTheme: string | undefined): "light" | "dark" {
  return resolvedTheme === "dark" ? "light" : "dark";
}

/**
 * Áp dụng đổi theme một lần — dùng View Transition API nếu có, fallback gọi trực tiếp.
 *
 * Defect fix #2: không gọi `switchTheme` hai lần khi `startViewTransition` thiếu.
 */
export function applyThemeTransition(switchTheme: () => void): void {
  if (document.startViewTransition) {
    document.startViewTransition(switchTheme);
  } else {
    switchTheme();
  }
}

const raysVariants = {
  hidden: {
    strokeOpacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    strokeOpacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rayVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0, scale: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      pathLength: { duration: 0.3 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.3 },
    },
  },
};

const shineVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 2,
    strokeDasharray: "20, 1000",
    strokeDashoffset: 0,
    filter: "blur(0px)",
  },
  visible: {
    opacity: [0, 1, 0],
    strokeDashoffset: [0, -50, -100],
    filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
    transition: { duration: 0.75, ease: "linear" },
  },
};

const sunPath =
  "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";
const moonPath =
  "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";

/** Nút dock chuyển light/dark với morph sun/moon và View Transition an toàn. */
export default function ModeToggle() {
  const playClick = useSound("/assets/button-click.mp3");
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const { setMetaColor } = useMetaColor();

  const switchTheme = useCallback(() => {
    const newTheme = getNextTheme(resolvedTheme);
    setTheme(newTheme);
    setMetaColor(resolvedTheme === "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark);
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      onClick={() => {
        playClick();
        applyThemeTransition(switchTheme);
      }}
    >
      <m.svg
        strokeWidth="4"
        strokeLinecap="round"
        width={20}
        height={20}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <m.path
          variants={shineVariant}
          d={moonPath}
          className="absolute top-0 left-0 stroke-blue-100"
          initial="hidden"
          animate={theme === "dark" ? "visible" : "hidden"}
        />
        <m.g
          variants={raysVariants}
          initial="hidden"
          animate={theme === "dark" ? "hidden" : "visible"}
          className="stroke-6 stroke-yellow-600"
          style={{ strokeLinecap: "round" }}
        >
          <m.path className="origin-center" variants={rayVariant} d="M50 2V11" />
          <m.path variants={rayVariant} d="M85 15L78 22" />
          <m.path variants={rayVariant} d="M98 50H89" />
          <m.path variants={rayVariant} d="M85 85L78 78" />
          <m.path variants={rayVariant} d="M50 98V89" />
          <m.path variants={rayVariant} d="M23 78L16 84" />
          <m.path variants={rayVariant} d="M11 50H2" />
          <m.path variants={rayVariant} d="M23 23L16 16" />
        </m.g>
        <m.path
          d={sunPath}
          fill="transparent"
          transition={{ duration: 1, type: "spring" }}
          initial={{ fillOpacity: 0, strokeOpacity: 0 }}
          animate={
            theme === "dark"
              ? {
                  d: moonPath,
                  rotate: -360,
                  scale: 2,
                  stroke: "white",
                  fill: "white",
                  fillOpacity: 0.35,
                  strokeOpacity: 1,
                  transition: { delay: 0.1 },
                }
              : {
                  d: sunPath,
                  rotate: 0,
                  stroke: "orange",
                  fill: "orange",
                  fillOpacity: 0.35,
                  strokeOpacity: 1,
                }
          }
        />
      </m.svg>
    </div>
  );
}
