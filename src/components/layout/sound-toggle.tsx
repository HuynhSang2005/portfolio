"use client";

import { Volume2Icon, VolumeOffIcon } from "lucide-react";

import { playToggleJingle } from "@/lib/sound";
import { useUiStore } from "@/providers/ui-store-provider";

/**
 * Nút bật/tắt âm thanh trên dock — đổi `soundEnabled` và phát jingle khi bật lại.
 *
 * Template: tắt âm im lặng; bật lại phát chuỗi C5→E5→G5→C6 tăng dần.
 */
export function SoundToggle() {
  const soundEnabled = useUiStore((s) => s.soundEnabled);
  const toggleSound = useUiStore((s) => s.toggleSound);

  const handleClick = () => {
    const unmuting = !soundEnabled;
    toggleSound();
    if (unmuting) {
      playToggleJingle(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-full w-full items-center justify-center"
      aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
    >
      {soundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
    </button>
  );
}
