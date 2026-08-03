"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import { SOUND_MUTED_STORAGE_KEY } from "@/lib/sound";
import { createUiStore, type UiStore } from "@/stores/ui-store";

export type UiStoreApi = ReturnType<typeof createUiStore>;

export const UiStoreContext = createContext<UiStoreApi | undefined>(undefined);

export function UiStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createUiStore());

  // Hydration sau mount: template lưu 'sound-muted' ('true' = đang tắt).
  useEffect(() => {
    const stored = window.localStorage.getItem(SOUND_MUTED_STORAGE_KEY);
    if (stored !== null) {
      store.setState({ soundEnabled: stored !== "true" });
    }
  }, [store]);

  return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
}

export function useUiStore<T>(selector: (store: UiStore) => T): T {
  const store = useContext(UiStoreContext);
  if (!store) {
    throw new Error("useUiStore must be used within UiStoreProvider");
  }
  return useStore(store, selector);
}
