"use client";

import { Volume2Icon, VolumeOffIcon } from "lucide-react";

import { useUiStore } from "@/providers/ui-store-provider";

/**
 * Nút bật/tắt âm thanh trên dock — chỉ đổi `soundEnabled` trong UI store.
 *
 * Phát âm thanh thật (Web Audio) được nối ở P2; P1 chỉ là stub trực quan.
 */
export function SoundToggle() {
  const soundEnabled = useUiStore((s) => s.soundEnabled);
  const toggleSound = useUiStore((s) => s.toggleSound);

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="flex h-full w-full items-center justify-center"
      aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
    >
      {soundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
    </button>
  );
}
