import { useLanguage } from '@/i18n/LanguageProvider';

interface EmptyStateProps {
  onHabitCreate: () => void;
}

export function EmptyState({ onHabitCreate }: EmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div className="empty-state">
      <button className="empty-state__button" onClick={onHabitCreate} aria-label="Add new habit">
        <h2 className="empty-state__title">{t('emptyState.buttonTitle')}</h2>
        <span className="empty-state__text">{t('emptyState.buttonText')}</span>
      </button>
    </div>
  );
}
