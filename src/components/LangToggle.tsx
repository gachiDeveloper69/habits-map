import { useLanguage } from '@/i18n/LanguageProvider';
import type { Language } from '@/i18n/types';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const LABEL_BY_LANG = {
  en: 'EN',
  ru: 'RU',
  am: 'AM',
} satisfies Record<Language, string>;

const NAME_BY_LANG: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  am: 'հայերեն',
};

export default function LangToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(prev => !prev);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="lang" ref={ref}>
      <button
        className="lang__trigger"
        aria-label={t('lang.ariaLabel')}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
      >
        {LABEL_BY_LANG[language]}
      </button>

      <div className={clsx('lang__popover', open && 'lang__popover--open')}>
        {(Object.keys(LABEL_BY_LANG) as Language[]).map(lang => (
          <button
            key={lang}
            className={clsx('lang__option', language === lang && 'is-active')}
            onClick={() => handleSelect(lang)}
          >
            <span>{NAME_BY_LANG[lang]}</span>
            {language === lang && <span className="lang__check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
