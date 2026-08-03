"use client";

import { useItemHoverSound } from "@/lib/hooks/use-item-hover-sound";

type MailtoLinkProps = {
  email: string;
};

/** Mailto fallback link with P2 hover sound — client island for RSC contact page. */
export function MailtoLink({ email }: MailtoLinkProps) {
  const playHoverSound = useItemHoverSound();

  if (!email) {
    return null;
  }

  return (
    <a
      href={`mailto:${email}`}
      className="font-medium text-foreground underline underline-offset-4"
      onMouseEnter={playHoverSound}
    >
      {email}
    </a>
  );
}
