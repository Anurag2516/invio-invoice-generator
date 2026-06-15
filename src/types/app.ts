export interface AppStore {
  theme: theme;
  changeTheme: (theme: theme) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export type theme = "dark" | "light";