'use client';
import TailwindSideNav from '@/app/ui/dashboard/tailwindSideNav';
import { useThemeStore } from '@/state/theme';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Remove old theme classes
    root.classList.remove('light', 'dark');

    // Apply the current theme
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={theme}>
      <TailwindSideNav>{children}</TailwindSideNav>
    </div>
  );
}
