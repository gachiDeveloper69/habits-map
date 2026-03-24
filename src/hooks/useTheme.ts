import { getSystemTheme, getStoredTheme, applyTheme, getTelegramTheme } from '@/utils/themeUtils';
import type { Theme } from '@/types/theme';
import { useEffect, useState, useLayoutEffect } from 'react';

function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getTelegramTheme() ?? getSystemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, []);

  const getNextTheme = (currentTheme: Theme): Theme => (currentTheme === 'dark' ? 'light' : 'dark');

  const switchTheme = () => {
    setTheme(prev => getNextTheme(prev));
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    switchTheme,
    getNextTheme,
  };
}
