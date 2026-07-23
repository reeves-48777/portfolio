import { create } from "zustand";

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('theme') || 'light',
  isDark: () => get().theme === 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    set({ theme: newTheme });
  },
  initTheme: () => {
    applyTheme(get().theme);
  }
}));
