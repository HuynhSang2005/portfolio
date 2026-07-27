"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import { createUiStore, type UiStore } from "@/stores/ui-store";

export type UiStoreApi = ReturnType<typeof createUiStore>;

export const UiStoreContext = createContext<UiStoreApi | undefined>(undefined);

export function UiStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createUiStore());

  return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
}

export function useUiStore<T>(selector: (store: UiStore) => T): T {
  const store = useContext(UiStoreContext);
  if (!store) {
    throw new Error("useUiStore must be used within UiStoreProvider");
  }
  return useStore(store, selector);
}
