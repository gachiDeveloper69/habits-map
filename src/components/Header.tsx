import { DeleteAll } from '@/components/DeleteAll';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Theme } from '@/types/theme';

interface HeaderProps {
  theme: Theme;
  onDeleteAll: () => void;
  onSwitchTheme: () => void;
}

export function Header({ theme, onDeleteAll, onSwitchTheme }: HeaderProps) {
  return (
    <header className="page-header">
      <DeleteAll onDeleteAll={onDeleteAll} />

      <h1 className="semantic-heading">Карта привычек</h1>
      <ThemeToggle currentTheme={theme} onThemeToggle={onSwitchTheme} />
    </header>
  );
}
