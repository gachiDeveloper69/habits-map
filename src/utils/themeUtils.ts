import type { Theme } from '@/types/theme';
import { THEME_CONSTANTS } from '@/constants/themeConstants';

export function getTelegramTheme(): Theme | null {
  const colorScheme = (window as any).Telegram?.WebApp?.colorScheme;

  if (colorScheme === 'dark') return 'dark';
  if (colorScheme === 'light') return 'light';

  return null;
}

export function getSystemTheme(): Theme {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (prefersDark) {
    return 'dark';
  }
  return 'light';
}

export function getStoredTheme(): Theme | null {
  const theme = window.localStorage.getItem(THEME_CONSTANTS.storageKey) || '';

  if (theme.trim() === 'dark') {
    return 'dark';
  }
  if (theme.trim() === 'light') {
    return 'light';
  }
  return null;
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_CONSTANTS.storageKey, theme);
}
