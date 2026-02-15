interface EmptyStateProps {
  onHabitCreate: () => void;
}

export function EmptyState({ onHabitCreate }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <button className="empty-state__button" onClick={onHabitCreate} aria-label="Add new habit">
        <h2 className="empty-state__title">НАЧНЁМ!</h2>
        <span className="empty-state__text">Добавьте свою первую привычку</span>
      </button>
    </div>
  );
}
