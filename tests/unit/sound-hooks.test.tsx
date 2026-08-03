import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { useHoverSound } from "@/lib/hooks/use-hover-sound";
import { useItemHoverSound } from "@/lib/hooks/use-item-hover-sound";
import { UiStoreContext } from "@/providers/ui-store-provider";
import { createUiStore } from "@/stores/ui-store";

/** Mock AudioContext tối thiểu cho jsdom — đủ cho hook DSP không ném lỗi. */
function installAudioContextMock() {
  class MockAudioContext {
    state = "running";
    currentTime = 0;
    sampleRate = 44100;

    resume() {
      return Promise.resolve();
    }

    createBuffer(channels: number, length: number, sampleRate: number) {
      const data = new Float32Array(length);
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData: () => data,
      };
    }

    createBufferSource() {
      return {
        buffer: null as AudioBuffer | null,
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }

    createBiquadFilter() {
      return { type: "bandpass", frequency: { value: 0 }, Q: { value: 0 }, connect: () => {} };
    }

    createGain() {
      return {
        gain: {
          setValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
      };
    }

    get destination() {
      return {};
    }
  }

  vi.stubGlobal("AudioContext", MockAudioContext);
}

function wrapperWithSound(soundEnabled: boolean) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const store = createUiStore({ sidebarOpen: false, soundEnabled });
    return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
  };
}

describe("sound hooks mute behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installAudioContextMock();
  });

  it("useHoverSound is a no-op when sound is disabled", () => {
    const { result } = renderHook(() => useHoverSound(), {
      wrapper: wrapperWithSound(false),
    });
    expect(() => result.current()).not.toThrow();
  });

  it("useItemHoverSound is a no-op when sound is disabled", () => {
    const { result } = renderHook(() => useItemHoverSound(), {
      wrapper: wrapperWithSound(false),
    });
    expect(() => result.current()).not.toThrow();
  });

  it("hooks do not throw without AudioContext support (jsdom)", () => {
    vi.unstubAllGlobals();
    const { result } = renderHook(() => useHoverSound(), {
      wrapper: wrapperWithSound(true),
    });
    expect(() => result.current()).not.toThrow();
  });

  it("useHoverSound plays without throw when sound is enabled", () => {
    const { result } = renderHook(() => useHoverSound(), {
      wrapper: wrapperWithSound(true),
    });
    expect(() => result.current()).not.toThrow();
  });
});
