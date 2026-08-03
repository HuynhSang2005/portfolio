"use client";

import { useCallback, useEffect, useRef } from "react";

import { getAudioContextClass } from "@/lib/sound";
import { useUiStore } from "@/providers/ui-store-provider";

/**
 * Hook phát file mp3 qua Web Audio API; no-op khi âm thanh bị tắt.
 *
 * @param url - Đường dẫn file âm thanh cần tải và phát.
 * @returns Hàm `play()` — gọi để phát âm thanh.
 */
export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const soundEnabled = useUiStore((s) => s.soundEnabled);

  useEffect(() => {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        bufferRef.current = decoded;
      })
      .catch((err) => {
        console.log(`Failed to load click sound from ${url}:`, err);
      });
  }, [url]);

  const play = useCallback(() => {
    if (!soundEnabled) return;

    if (audioCtxRef.current && bufferRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioCtxRef.current.destination);
      source.start(0);
    }
  }, [soundEnabled]);

  return play;
}
