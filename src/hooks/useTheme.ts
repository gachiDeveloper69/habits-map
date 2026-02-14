import { getSystemTheme, getStoredTheme, applyTheme } from '@/utils/themeUtils';
import type { Theme } from '@/types/theme';
import { useEffect, useState, useLayoutEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useLayoutEffect(() => {
    const initialTheme = getStoredTheme() ?? getSystemTheme();

    if (initialTheme && initialTheme !== theme) {
      try {
        setTheme(initialTheme);
        applyTheme(initialTheme);
      } catch (e) {
        throw new Error(`Не удалось применить тему: ${initialTheme} - ${e}`);
      }
    }
  }, []);

  const getNextTheme = (theme: Theme) => (theme === 'dark' ? 'light' : 'dark');
  const switchTheme = () => {
    try {
      setTheme(prev => getNextTheme(prev));
    } catch (e) {
      throw new Error(`Не удалось поменять тему: ${e}`);
    }
  };

  useEffect(() => applyTheme(theme), [theme]);

  return {
    theme,
    switchTheme,
    getNextTheme,
  };
}
