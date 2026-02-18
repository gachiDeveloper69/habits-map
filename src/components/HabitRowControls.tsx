import clsx from 'clsx';
import Plus from '@/icons/plus.svg?react';
import Edit from '@/icons/edit.svg?react';
import Delete from '@/icons/delete.svg?react';

export type HabitRowControlsState = 'inactive' | 'active' | 'edit';

interface HabitRowControlsProps {
  state: HabitRowControlsState;
  onEdit?: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onDeactivate: () => void;
}

export function HabitRowControls({
  state,
  onEdit,
  onDelete,
  onAddAbove,
  onAddBelow,
  onDeactivate,
}: HabitRowControlsProps) {
  const actionButtons = [
    {
      id: 'edit',
      icon: Edit,
      position: 'right',
      action: () => onEdit?.(),
      label: 'Редактировать',
    },
    {
      id: 'delete',
      icon: Delete,
      position: 'left',
      action: onDelete,
      label: 'Удалить',
    },
    {
      id: 'addAbove',
      icon: Plus,
      position: 'top',
      action: onAddAbove,
      label: 'Добавить сверху',
    },
    {
      id: 'addBelow',
      icon: Plus,
      position: 'bottom',
      action: onAddBelow,
      label: 'Добавить снизу',
    },
  ];

  return (
    <div className="habit-row__actions">
      {actionButtons.map(({ id, icon: Icon, position, action, label }) => (
        <button
          key={id}
          className={clsx(
            'habit-row__action-button',
            `habit-row__action-button--${id}`,
            `habit-row__action-button--${state}`,
            `habit-row__action-button--${position}`
          )}
          onClick={e => {
            e.stopPropagation();
            action();
            onDeactivate(); // Опционально: закрыть после действия
          }}
          aria-label={label}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
