import { createStore } from "zustand/vanilla";

/** Trạng thái UI toàn cục — sidebar và âm thanh. */
export type UiState = {
  sidebarOpen: boolean;
  soundEnabled: boolean;
};

/** Hành động thay đổi trạng thái UI. */
export type UiActions = {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleSound: () => void;
};

/** Store UI kết hợp state và actions. */
export type UiStore = UiState & UiActions;

/** Giá trị mặc định của UI store — sidebar đóng, âm thanh bật. */
export const defaultUiState: UiState = {
  sidebarOpen: false,
  soundEnabled: true,
};

/**
 * Tạo vanilla Zustand store cho UI shell.
 *
 * @param initState - Trạng thái khởi tạo; mặc định {@link defaultUiState}.
 * @returns Store API có `getState`, `setState`, `subscribe`.
 */
export const createUiStore = (initState: UiState = defaultUiState) => {
  return createStore<UiStore>()((set) => ({
    ...initState,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  }));
};
