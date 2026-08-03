import { describe, expect, it } from "vitest";

import { createUiStore } from "@/stores/ui-store";

describe("ui-store sound slice", () => {
  it("defaults to sound enabled", () => {
    const store = createUiStore();
    expect(store.getState().soundEnabled).toBe(true);
  });

  it("toggleSound flips the flag", () => {
    const store = createUiStore();
    store.getState().toggleSound();
    expect(store.getState().soundEnabled).toBe(false);
    store.getState().toggleSound();
    expect(store.getState().soundEnabled).toBe(true);
  });
});
