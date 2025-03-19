import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  theme: string; // "light" or "dark"
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // Default to light, will sync with localStorage
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          return { theme: newTheme };
        }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // Key for localStorage
    },
  ),
);
