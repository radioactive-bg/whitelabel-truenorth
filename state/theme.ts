import { create } from 'zustand';

type ThemeState = {
  theme: string; // "light" or "dark"
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme:
    typeof window !== 'undefined'
      ? localStorage.getItem('theme') || 'light'
      : 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
