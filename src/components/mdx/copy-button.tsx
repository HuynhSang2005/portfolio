"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
};

/** Nút copy clipboard cho code block — client island với feedback "Copied". */
export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard không khả dụng (quyền) — không quan trọng.
        }
      }}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
    </button>
  );
}
