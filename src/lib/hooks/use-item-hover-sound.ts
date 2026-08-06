"use client";

import { useCallback, useRef } from "react";

import { createAudioContext } from "@/lib/sound";
import { useUiStore } from "@/providers/ui-store-provider";

/**
 * Tiếng "pop" mềm khi hover mục danh sách — DSP template verbatim (bandpass 2200Hz, throttle 80ms).
 *
 * @returns Hàm `play()` — gọi khi hover item; no-op khi âm thanh tắt.
 */
export function useItemHoverSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const soundEnabled = useUiStore((s) => s.soundEnabled);

  const play = useCallback(() => {
    if (!soundEnabled) return;

    // Throttle: không phát nếu chưa đủ 80ms kể từ lần trước
    const now = Date.now();
    if (now - lastPlayedRef.current < 80) return;
    lastPlayedRef.current = now;

    try {
      if (!audioCtxRef.current) {
        const ctx = createAudioContext();
        if (!ctx) return;
        audioCtxRef.current = ctx;
      }

      const ctx = audioCtxRef.current;

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const duration = 0.06;
      const currentTime = ctx.currentTime;

      // DSP tốn kém — chỉ tổng hợp noise buffer một lần rồi tái sử dụng.
      if (!noiseBufferRef.current) {
        const bufferSize = ctx.sampleRate * duration;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        noiseBufferRef.current = noiseBuffer;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBufferRef.current;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 2200;
      bandpass.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      source.start(currentTime);
      source.stop(currentTime + duration);
    } catch {
      // Âm thanh không quan trọng — bỏ qua lỗi.
    }
  }, [soundEnabled]);

  return play;
}
