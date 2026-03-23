import { LANG_CONSTANTS, DEFAULT_LANGUAGE } from '@/constants/langConstants';
import { isLanguage } from '@/i18n/types';

export function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return undefined;

  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }

    return undefined;
  }, obj);
}

export function getInitialLocale() {
  const saved = localStorage.getItem(LANG_CONSTANTS.storageKey);

  if (saved && isLanguage(saved)) {
    return saved;
  }

  const browserLanguage = navigator.language.slice(0, 2);

  if (isLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return DEFAULT_LANGUAGE;
}
