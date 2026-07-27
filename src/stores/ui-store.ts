import { createStore } from "zustand/vanilla";

export type UiState = {
  sidebarOpen: boolean;
};

export type UiActions = {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  sidebarOpen: false,
};

export const createUiStore = (initState: UiState = defaultUiState) => {
  return createStore<UiStore>()((set) => ({
    ...initState,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  }));
};
