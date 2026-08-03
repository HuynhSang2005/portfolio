import "@testing-library/jest-dom/vitest";

/** Polyfill jsdom thiếu — PronounceMyName và hero test cần constructor này. */
if (typeof globalThis.SpeechSynthesisUtterance === "undefined") {
  globalThis.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
    text: string;
    lang = "";
    rate = 1;
    pitch = 1;
    constructor(text?: string) {
      this.text = text ?? "";
    }
  } as unknown as typeof SpeechSynthesisUtterance;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
