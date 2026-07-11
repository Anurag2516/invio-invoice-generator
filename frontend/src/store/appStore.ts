import { create } from "zustand";
import type { AppStore } from "../types/app";
import { persist } from "zustand/middleware";

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: false,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: "app-store" },
  ),
);