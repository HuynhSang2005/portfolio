"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Dock, DockIcon, DockIconActiveDot } from "@/components/layout/floating-dock";
import ModeToggle from "@/components/layout/mode-toggle";
import { SoundToggle } from "@/components/layout/sound-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Thời gian idle (ms) trước khi dock tự ẩn xuống. */
const DOCK_AUTOHIDE_TIMEOUT = 5_000;

/**
 * Dock desktop cố định dưới màn hình — navbar, socials (nếu có), sound/theme.
 *
 * Defect fix #1: timer auto-hide luôn được gán khi `startTimeout` chạy (kể cả lần đầu).
 */
function BottomDock({ className }: { className: string }) {
  const [active, setActive] = useState(true);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isItemActive = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(itemHref);
  };

  const startTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, DOCK_AUTOHIDE_TIMEOUT);
  };

  useEffect(() => {
    startTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={() => {
        setActive(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        startTimeout();
      }}
      className={cn(
        "-translate-x-1/2 fixed bottom-0 left-1/2 z-40 h-[clamp(80px,10vh,200px)] w-full",
        className,
      )}
    >
      <div className="mask-[linear-gradient(to_top,#000_25%,transparent)] absolute top-0 left-0 h-full w-full backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_top,#000_25%,transparent)]" />
      <Dock
        className={cn("transition-all duration-300", {
          "-bottom-18": !active,
        })}
      >
        {siteConfig.navbar.map((item) => {
          const ItemIcon = Icons[item.icon];
          return (
            <DockIcon key={item.label} title={item.label}>
              <Link href={item.href}>
                <ItemIcon className="size-4" />
              </Link>
              {isItemActive(item.href) && <DockIconActiveDot isActive={isItemActive(item.href)} />}
            </DockIcon>
          );
        })}
        {siteConfig.socials.length > 0 && (
          <>
            <DockSeparator />
            {siteConfig.socials.map((social) => {
              const SocialIcon = Icons[social.icon];
              return (
                <DockIcon key={social.name} title={social.name}>
                  <Link href={social.url} target="_blank">
                    <SocialIcon className="size-4" />
                  </Link>
                </DockIcon>
              );
            })}
          </>
        )}
        <DockSeparator />
        <DockIcon title="Sound">
          <SoundToggle />
        </DockIcon>
        <DockIcon title="Theme">
          <ModeToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}

/** Vạch phân cách dọc giữa các nhóm icon dock. */
function DockSeparator() {
  return <hr className="mask-gradient h-[36px] w-px shrink-0 border-0 bg-gray-400/50" />;
}

export default BottomDock;
