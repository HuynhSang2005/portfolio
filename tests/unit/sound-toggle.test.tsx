import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SoundToggle } from "@/components/layout/sound-toggle";
import { playToggleJingle } from "@/lib/sound";
import { UiStoreProvider } from "@/providers/ui-store-provider";

vi.mock("@/lib/sound", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/sound")>();
  return { ...actual, playToggleJingle: vi.fn() };
});

describe("SoundToggle jingle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(playToggleJingle).mockClear();
  });

  it("plays the ascending jingle only when unmuting", () => {
    render(
      <UiStoreProvider>
        <SoundToggle />
      </UiStoreProvider>,
    );
    const button = screen.getByRole("button", { name: "Mute sounds" });

    // First click: mute (sound was on) — silent, matches template.
    fireEvent.click(button);
    expect(playToggleJingle).not.toHaveBeenCalled();

    // Second click: unmute — ascending jingle.
    fireEvent.click(screen.getByRole("button", { name: "Unmute sounds" }));
    expect(playToggleJingle).toHaveBeenCalledTimes(1);
    expect(playToggleJingle).toHaveBeenCalledWith(true);
  });
});
