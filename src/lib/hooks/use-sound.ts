"use client";

import { useCallback, useRef } from "react";

import { getAudioContextClass } from "@/lib/sound";
import { useUiStore } from "@/providers/ui-store-provider";

/**
 * Hook phát file mp3 qua Web Audio API; no-op khi âm thanh bị tắt.
 * AudioContext + fetch mp3 chỉ khởi tạo ở lần `play()` đầu tiên (tránh tải khi user mute).
 *
 * @param url - Đường dẫn file âm thanh cần tải và phát.
 * @returns Hàm `play()` — gọi để phát âm thanh.
 */
export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const loadingRef = useRef(false);
  const soundEnabled = useUiStore((s) => s.soundEnabled);

  const play = useCallback(() => {
    if (!soundEnabled) return;

    if (!audioCtxRef.current) {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) return;
      audioCtxRef.current = new AudioContextClass();
    }

    const audioCtx = audioCtxRef.current;

    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }

    const playBuffer = () => {
      if (!bufferRef.current) return;
      const source = audioCtx.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioCtx.destination);
      source.start(0);
    };

    if (bufferRef.current) {
      playBuffer();
      return;
    }

    // Lần đầu: tải + decode, rồi phát ngay khi sẵn sàng.
    if (!loadingRef.current) {
      loadingRef.current = true;
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => audioCtx.decodeAudioData(data))
        .then((decoded) => {
          bufferRef.current = decoded;
          playBuffer();
        })
        .catch((err) => {
          console.log(`Failed to load click sound from ${url}:`, err);
        });
    }
  }, [soundEnabled, url]);

  return play;
}
