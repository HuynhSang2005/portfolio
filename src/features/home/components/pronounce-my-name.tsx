"use client";

import { Volume2Icon } from "lucide-react";
import { useCallback } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Nút phát tên qua Web Speech API — ngôn ngữ từ `siteConfig.pronunciationLang`.
 *
 * @param name - Tên cần phát; bỏ qua nếu không có `speechSynthesis`.
 */
export function PronounceMyName({ className, name }: { className?: string; name?: string }) {
  const speak = useCallback(() => {
    if (name && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.lang = siteConfig.pronunciationLang;
      window.speechSynthesis.speak(utterance);
    }
  }, [name]);

  return (
    <button
      type="button"
      className={cn(
        "relative text-muted-foreground transition-all hover:text-foreground active:scale-[0.9]",
        "after:-inset-1 after:absolute",
        className,
      )}
      onClick={speak}
    >
      <Volume2Icon className="size-4" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  );
}
