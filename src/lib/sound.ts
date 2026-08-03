"use client";

/** Khóa localStorage cho trạng thái tắt âm — `"true"` nghĩa là đang tắt. */
export const SOUND_MUTED_STORAGE_KEY = "sound-muted";

/**
 * Lấy constructor `AudioContext` (hoặc `webkitAudioContext`) nếu trình duyệt hỗ trợ.
 *
 * @returns Constructor hoặc `undefined` khi không có Web Audio API (SSR/jsdom).
 */
export function getAudioContextClass(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

/**
 * Tạo `AudioContext` mới; trả về `null` khi API không khả dụng.
 *
 * @returns Instance AudioContext hoặc `null`.
 */
export function createAudioContext(): AudioContext | null {
  const AudioContextClass = getAudioContextClass();
  return AudioContextClass ? new AudioContextClass() : null;
}

/**
 * Jingle bật/tắt âm thanh — DSP template verbatim.
 * Bật: C5→E5→G5→C6 tăng dần; tắt: G5→C5 giảm dần.
 *
 * @param turningOn - `true` khi đang bật âm, `false` khi tắt.
 */
export function playToggleJingle(turningOn: boolean): void {
  try {
    const ctx = createAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const currentTime = ctx.currentTime;

    if (turningOn) {
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, currentTime + i * 0.06);

        noteGain.gain.setValueAtTime(0, currentTime + i * 0.06);
        noteGain.gain.linearRampToValueAtTime(0.12, currentTime + i * 0.06 + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.06 + 0.08);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(currentTime + i * 0.06);
        osc.stop(currentTime + i * 0.06 + 0.1);
      });
    } else {
      const notes = [784, 523]; // G5, C5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, currentTime + i * 0.08);

        noteGain.gain.setValueAtTime(0, currentTime + i * 0.08);
        noteGain.gain.linearRampToValueAtTime(0.08, currentTime + i * 0.08 + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.08 + 0.1);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(currentTime + i * 0.08);
        osc.stop(currentTime + i * 0.08 + 0.12);
      });
    }
  } catch {
    // Âm thanh không quan trọng — bỏ qua lỗi.
  }
}
