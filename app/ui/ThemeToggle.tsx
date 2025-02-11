import { useThemeStore } from '@/state/theme';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6 text-gray-100" />
      )}
    </button>
  );
}
