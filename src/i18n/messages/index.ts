import en from './en';
import ru from './ru';
import am from './am';

import type { Language, Messages } from '@/i18n/types';
import type { NestedKeyOf } from './typed-keys';

export const messages: Record<Language, Messages> = {
  en,
  ru,
  am,
};

export type TranslationKey = NestedKeyOf<Messages>;
