"use client";

import { useTheme } from "@wrksz/themes/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface CraftCardProps {
  slug: string;
  src: string;
  srcDark?: string;
  title: string;
  date: string;
  craftType: string;
  theme: string;
  position?: string;
  className?: string;
  type?: "image" | "video";
  aspectRatio?: number;
}

export function CraftCard({
  slug,
  title,
  date,
  src,
  srcDark,
  craftType,
  theme,
  aspectRatio = 4 / 3,
  position = "bottom",
  className = "",
  type = "video",
}: CraftCardProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isVideo = type === "video";
  const activeSrc = srcDark && resolvedTheme === "dark" ? srcDark : src;

  // Lazy: chỉ tải video khi card gần viewport. jsdom không có IntersectionObserver → coi như visible.
  useEffect(() => {
    if (!isVideo) {
      return;
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) {
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (!isVisible) {
      videoElement.pause();
      return;
    }

    // Chỉ tải (lại) khi src theme thực sự đổi — tránh download kép khi re-render.
    if (videoElement.getAttribute("src") !== activeSrc) {
      setIsVideoLoaded(false);
      videoElement.src = activeSrc;
      videoElement.load();
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // jsdom trả undefined thay vì Promise — optional chain để test không ném lỗi.
    void videoElement.play()?.catch(() => {});
  }, [isVideo, isVisible, activeSrc]);

  return (
    <div
      className={cn(
        "block w-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-200",
        className,
        {
          "p-1": craftType !== "none",
        },
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          "after:pointer-events-none after:absolute after:bottom-[-64px] after:h-[200px] after:w-full after:bg-linear-to-t after:from-black/90 after:via-transparent after:to-transparent after:transition-opacity after:duration-200 after:content-['']",
          {
            "rounded-lg": craftType !== "none",
          },
        )}
      >
        <div ref={containerRef} className="relative w-full" style={{ aspectRatio }}>
          {isVideo ? (
            <video
              ref={videoRef}
              preload="none"
              loop
              muted
              playsInline
              aria-hidden="true"
              onLoadedData={() => setIsVideoLoaded(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                {
                  "opacity-0": !isVideoLoaded,
                  "opacity-100": isVideoLoaded,
                },
              )}
            />
          ) : (
            // oxlint-disable-next-line nextjs/no-img-element -- craft card supports static image previews
            <img
              src={src}
              onLoad={() => setIsImageLoaded(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                {
                  "opacity-0": !isImageLoaded,
                  "opacity-100": isImageLoaded,
                },
              )}
              alt={title}
            />
          )}
        </div>

        <div
          className={cn(
            "absolute left-0 z-20 flex h-8 w-full flex-row flex-nowrap items-center justify-between gap-3 whitespace-nowrap p-4 transition-opacity delay-200",
            {
              "top-2": position === "top",
              "bottom-2": position === "bottom",
            },
          )}
        >
          <h2
            className={cn("overflow-hidden text-ellipsis whitespace-nowrap text-sm", {
              "text-neutral-100": theme === "light",
              "text-neutral-900": theme === "dark",
            })}
          >
            {title}
          </h2>
          <div
            className={cn("overflow-hidden text-ellipsis whitespace-nowrap text-sm", {
              "text-neutral-400": theme === "light",
              "text-neutral-800/60": theme === "dark",
            })}
          >
            {date}
          </div>
        </div>
      </div>

      {craftType !== "none" && (
        <Link
          href={`/craft/${slug}`}
          data-fake-button
          className="mt-1 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-muted font-medium text-foreground text-sm transition-colors duration-150 hover:bg-accent"
        >
          View details
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
