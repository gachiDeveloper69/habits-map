import clsx from 'clsx';
import Plus from '@/icons/plus.svg?react';
import Edit from '@/icons/edit.svg?react';
import Delete from '@/icons/delete.svg?react';
import Apply from '@/icons/check.svg?react';
import Cancel from '@/icons/cancel.svg?react';

export type HabitRowControlsState = 'inactive' | 'active' | 'edit';

interface HabitRowControlsProps {
  state: HabitRowControlsState;
  applyEnabled: boolean;
  onEdit?: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onDeactivate: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onCommitEdit: () => void;
}

export function HabitRowControls({
  state,
  applyEnabled,
  onDelete,
  onAddAbove,
  onAddBelow,
  onDeactivate,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
}: HabitRowControlsProps) {
  const mainVisible = state === 'active';
  const editVisible = state === 'edit';

  const mainButtons = [
    {
      id: 'edit',
      icon: Edit,
      position: 'right',
      action: onStartEdit,
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
  const editButtons = [
    {
      id: 'apply',
      icon: Apply,
      position: 'right',
      action: onCommitEdit,
      label: 'Добавить снизу',
      disabled: !applyEnabled,
    },
    {
      id: 'cancel',
      icon: Cancel,
      position: 'left',
      action: onCancelEdit,
      label: 'Добавить снизу',
    },
  ];

  const renderBtn = (btn: any, visible: boolean) => {
    const Icon = btn.icon;
    return (
      <button
        key={btn.id}
        className={clsx(
          'habit-row__action-button',
          `habit-row__action-button--${btn.id}`,
          visible ? 'habit-row__action-button--active' : 'habit-row__action-button--inactive',
          `habit-row__action-button--${btn.position}`
        )}
        onPointerUp={e => {
          e.stopPropagation();
          btn.action();
          // В edit-режиме не деактивируем ряд автоматически (кроме apply/cancel — потом решим логикой)
          if (state === 'active' && btn.id !== 'edit') onDeactivate();
        }}
        aria-label={btn.label}
        disabled={btn.disabled ?? false}
      >
        <Icon />
      </button>
    );
  };

  return (
    <div className="habit-row__actions">
      {/* MAIN CONTROLS */}
      {mainButtons.map(btn => renderBtn(btn, mainVisible))}

      {/* EDIT CONTROLS */}
      {editButtons.map(btn => renderBtn(btn, editVisible))}
    </div>
  );
}
