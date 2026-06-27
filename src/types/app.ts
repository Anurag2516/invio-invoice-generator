export type theme = "dark" | "light";

export interface AppStore {
  theme: theme;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}