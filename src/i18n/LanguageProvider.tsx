import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { messages, type TranslationKey } from './messages/index';
import type { Language } from './types';
import type { ReactNode } from 'react';
import { getNestedValue, getInitialLocale } from '@/utils/langUtils';
import { DEFAULT_LANGUAGE, LANG_CONSTANTS } from '@/constants/langConstants';

type LanguageProviderProps = {
  children: ReactNode;
};

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (path: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => getInitialLocale());

  const t = useCallback(
    (path: TranslationKey): string => {
      let value;
      const fallbackValue = getNestedValue(messages[DEFAULT_LANGUAGE], path);

      const currentValue = getNestedValue(messages[language], path);
      if (currentValue !== undefined) {
        value = currentValue;
      } else {
        value = fallbackValue;
      }

      return typeof value === 'string' ? value : path;
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t,
    };
  }, [language, t]);

  useEffect(() => {
    localStorage.setItem(LANG_CONSTANTS.storageKey, language);
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('Use useLanguage must be used inside LanguageProvider');
  }

  return context;
}
