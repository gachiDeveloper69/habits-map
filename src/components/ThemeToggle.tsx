import type { Theme } from '@/types/theme';

import Sun from '@/icons/sun.svg?react';
import Moon from '@/icons/moon.svg?react';

const ICON_BY_THEME = {
  light: Moon,
  dark: Sun,
} as const;

type ThemeToggleProps = {
  currentTheme: Theme;
  onThemeToggle: () => void;
};

export function ThemeToggle({ currentTheme, onThemeToggle }: ThemeToggleProps) {
  const ThemeIcon = ICON_BY_THEME[currentTheme];

  return (
    <button className="theme-toggle" aria-label="Toggle theme" onClick={() => onThemeToggle()}>
      <ThemeIcon className="theme-toggle__icon" />
    </button>
  );
}
