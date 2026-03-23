import { DeleteAll } from '@/components/DeleteAll';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Theme } from '@/types/theme';
import LangToggle from '@/components/LangToggle';
import { useLanguage } from '@/i18n/LanguageProvider';

interface HeaderProps {
  theme: Theme;
  onDeleteAll: () => void;
  onSwitchTheme: () => void;
}

export function Header({ theme, onDeleteAll, onSwitchTheme }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="page-header">
      <DeleteAll onDeleteAll={onDeleteAll} />

      <h1 className="semantic-heading">{t('header.heading')}</h1>
      <div className="toggles">
        <ThemeToggle currentTheme={theme} onThemeToggle={onSwitchTheme} />
        <LangToggle />
      </div>
    </header>
  );
}
