export const SUPPORTED_LANGUAGES = ['ru', 'en', 'am'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export interface Messages {
  emptyState: {
    buttonTitle: string;
    buttonText: string;
  };

  habitRow: {
    inputArLabel: string;
  };

  header: {
    heading: string;
  };

  rating: {
    ariaLabel: string;
  };

  theme: {
    ariaLabel: string;
  };

  lang: {
    ariaLabel: string;
  };

  newHabitName: {
    default: string;
  };

  deleteAll: {
    ariaLabel: string;
    confirmText: string;
    cancelLabel: string;
    confirmLabel: string;
  };

  habitControls: {
    edit: string;
    delete: string;
    addAbove: string;
    addBelow: string;
    apply: string;
    cancel: string;
  };
}
