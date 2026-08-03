"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { buttonVariants } from "@/components/ui/button";
import { MOBILE_SCROLL_THRESHOLD } from "@/config/site";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

/**
 * Header mobile sticky — drawer hoặc nút back, tiêu đề reveal khi scroll.
 *
 * `scrollTitle` animation dùng `scrollTop` từ `useScrollDirection` (Task 4).
 */
export const FloatingHeader = memo(
  ({
    className,
    scrollTitle,
    title,
    children,
  }: {
    className?: string;
    scrollTitle?: string;
    title?: string;
    children?: React.ReactNode;
  }) => {
    const { scrollTop } = useScrollDirection();
    const pathname = usePathname();

    const transformValues = useMemo(() => {
      if (!scrollTitle) {
        return { translateY: 0, opacity: 1 };
      }
      const scrollY = scrollTop;
      const translateY = Math.max(100 - scrollY, 0);
      const opacity = Math.min(
        Math.max(
          (scrollY - MOBILE_SCROLL_THRESHOLD * (MOBILE_SCROLL_THRESHOLD / (scrollY ** 2 / 100))) /
            100,
          0,
        ),
        1,
      );
      return { translateY, opacity };
    }, [scrollTop, scrollTitle]);

    const goBack = pathname.split("/").length > 2;
    const goBackLink = pathname.split("/").slice(0, -1).join("/") || "/";

    return (
      <header
        className={cn(
          "sticky inset-x-0 top-0 z-40 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b bg-background font-medium text-sm lg:hidden",
          className,
        )}
      >
        <div className="flex size-full items-center px-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-1">
              {goBack ? (
                <Link
                  href={goBackLink}
                  title="Go back"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0")}
                >
                  <ArrowLeftIcon size={16} />
                </Link>
              ) : (
                <MobileDrawer />
              )}
              <div className="flex flex-1 items-center justify-between">
                {scrollTitle && (
                  <span
                    className="line-clamp-2 font-semibold tracking-tight"
                    style={{
                      transform: `translateY(${transformValues.translateY}%)`,
                      opacity: transformValues.opacity,
                    }}
                  >
                    {scrollTitle}
                  </span>
                )}
                {title && (
                  <span className="line-clamp-2 font-semibold tracking-tight">{title}</span>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  },
);

FloatingHeader.displayName = "FloatingHeader";
