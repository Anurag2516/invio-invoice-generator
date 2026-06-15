import { create } from "zustand";
import type { AppStore } from "../types/app";
import { persist } from "zustand/middleware";


export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      sidebarOpen: false,

      changeTheme: (theme) => {
        set({ theme: theme });
      },

      toggleSidebar: () => {
        const {sidebarOpen} = get();
        set({ sidebarOpen : !sidebarOpen});
      },
    }),
    { name: "app-store" },
  ),
);