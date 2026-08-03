import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SOUND_MUTED_STORAGE_KEY } from "@/lib/sound";
import { UiStoreProvider, useUiStore } from "@/providers/ui-store-provider";

function Probe() {
  const soundEnabled = useUiStore((s) => s.soundEnabled);
  const toggleSound = useUiStore((s) => s.toggleSound);
  return (
    <button type="button" onClick={toggleSound} data-testid="probe">
      {String(soundEnabled)}
    </button>
  );
}

describe("sound-muted persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("hydrates soundEnabled=false when stored value is 'true'", async () => {
    localStorage.setItem(SOUND_MUTED_STORAGE_KEY, "true");
    render(
      <UiStoreProvider>
        <Probe />
      </UiStoreProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("probe").textContent).toBe("false");
    });
  });

  it("hydrates soundEnabled=true when stored value is 'false'", async () => {
    localStorage.setItem(SOUND_MUTED_STORAGE_KEY, "false");
    render(
      <UiStoreProvider>
        <Probe />
      </UiStoreProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("probe").textContent).toBe("true");
    });
  });

  it("defaults to enabled and writes 'true' on first toggle", () => {
    render(
      <UiStoreProvider>
        <Probe />
      </UiStoreProvider>,
    );
    act(() => screen.getByTestId("probe").click());
    expect(localStorage.getItem(SOUND_MUTED_STORAGE_KEY)).toBe("true");
    act(() => screen.getByTestId("probe").click());
    expect(localStorage.getItem(SOUND_MUTED_STORAGE_KEY)).toBe("false");
  });
});
