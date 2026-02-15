import type { HabitItem } from '@/types/habits';
import clsx from 'clsx';
import DragHandle from '@/icons/drag-handle.svg?react';
import MockToggle from '@/icons/mock-toggle.svg?react';
import Plus from '@/icons/plus.svg?react';
import Edit from '@/icons/edit.svg?react';
import Delete from '@/icons/delete.svg?react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HabitRowProps {
  habit: HabitItem;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  onAddSideBy: (index: number) => void;
}

export function HabitRow({
  habit,
  onActivate,
  onDeactivate,
  onEdit,
  onDelete,
  onAddSideBy,
}: HabitRowProps) {
  const [isActive, setIsActive] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isTouchMove, SetIsTouchMove] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const rowRef = useRef<HTMLElement>(null);

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
      action: () => onDelete(habit.id),
      label: 'Удалить',
    },
    {
      id: 'addAbove',
      icon: Plus,
      position: 'top',
      action: () => onAddSideBy(habit.order + 1),
      label: 'Добавить сверху',
    },
    {
      id: 'addBelow',
      icon: Plus,
      position: 'bottom',
      action: () => onAddSideBy(habit.order - 1 >= 0 ? habit.order - 1 : 0),
      label: 'Добавить снизу',
    },
  ];

  //закрытие по клику снаружи
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
        handleDeactivate();
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  //защита от тапов при скролле
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    SetIsTouchMove(false);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = Math.abs(currentY - touchStartY);

    if (diff > 10) {
      SetIsTouchMove(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;

    if (!isTouchMove && touchDuration < 300) {
      handleCardToggle();
    }
  };

  const handleCardToggle = () => {
    if (isActive) {
      handleDeactivate();
    } else {
      handleActivate();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('.habit-row__action-button');
    const isDrag = target.closest('.habit-row__drag');
    const isToggle = target.closest('.habit-row__toggle');

    if (!isActionButton && !isDrag && !isToggle) {
      handleCardToggle();
    }
  };

  const handleDragClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // console.log('Начать перетаскивание');
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // console.log('Переключить статус');
  };

  const handleActivate = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      onActivate?.();
    }
  }, [isActive, onActivate]);

  const handleDeactivate = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      onDeactivate?.();
    }
  }, [isActive, onDeactivate]);

  return (
    <article
      ref={rowRef}
      className={clsx('habit-row', `row-${habit.rating}`, { 'habit-row--active': isActive })}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="habit-row__drag" onClick={handleDragClick}>
        <DragHandle />
      </div>
      <div className="habit-row__title">{habit.title}</div>
      <div onClick={handleToggleClick} className="habit-row__toggle">
        <MockToggle />
      </div>

      {/* CONTROLS */}
      {isActive && (
        <div className="habit-row__actions">
          {actionButtons.map(({ id, icon: Icon, position, action, label }) => (
            <button
              key={id}
              className={clsx('habit-row__action-button', `habit-row__action-button--${position}`)}
              onClick={e => {
                e.stopPropagation();
                action();
                handleDeactivate(); // Опционально: закрыть после действия
              }}
              aria-label={label}
            >
              <Icon />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
