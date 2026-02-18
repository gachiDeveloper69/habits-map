import type { HabitItem } from '@/types/habits';
import clsx from 'clsx';
import DragHandle from '@/icons/drag-handle.svg?react';
import MockToggle from '@/icons/mock-toggle.svg?react';
import Plus from '@/icons/plus.svg?react';
import Edit from '@/icons/edit.svg?react';
import Delete from '@/icons/delete.svg?react';
import { useEffect, useRef, useState } from 'react';

interface HabitRowProps {
  habit: HabitItem;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
}

export function HabitRow({
  habit,
  isActive,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onAddAbove,
  onAddBelow,
}: HabitRowProps) {
  const rowRef = useRef<HTMLElement>(null);
  const pointerData = useRef({
    startX: 0,
    startY: 0,
    moved: false,
    pointerId: null as number | null,
  });

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

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerData.current.startX = e.clientX;
    pointerData.current.startY = e.clientY;
    pointerData.current.moved = false;
    pointerData.current.pointerId = e.pointerId;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerData.current.pointerId) return;
    const threshold = 10;
    const trackX = Math.abs(pointerData.current.startX - e.clientX);
    const trackY = Math.abs(pointerData.current.startY - e.clientY);
    if (trackX > threshold || trackY > threshold) {
      pointerData.current.moved = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerData.current.pointerId) return;

    if (!pointerData.current.moved) {
      isActive ? onDeactivate() : onActivate();
    }
    pointerData.current.pointerId = null;
  };

  const handleDragClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    // console.log('Начать перетаскивание');
  };

  const handleToggleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    // console.log('Переключить статус');
  };

  return (
    <article
      ref={rowRef}
      className={clsx('habit-row', `row-${habit.rating}`, { 'habit-row--active': isActive })}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="habit-row__drag" onPointerDown={handleDragClick}>
        <DragHandle />
      </div>
      <div className="habit-row__title">{habit.title}</div>
      <div onPointerDown={handleToggleClick} className="habit-row__toggle">
        <MockToggle />
      </div>

      {/* CONTROLS */}

      <div className="habit-row__actions">
        {actionButtons.map(({ id, icon: Icon, position, action, label }) => (
          <button
            key={id}
            className={clsx(
              'habit-row__action-button',
              `habit-row__action-button--${id}`,
              isActive ? `habit-row__action-button--active` : `habit-row__action-button--inactive`,
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
    </article>
  );
}
