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
  onDelete: (id: string) => void;
  onAddSideBy: (index: number) => void;
}

export function HabitRow({
  habit,
  isActive,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onAddSideBy,
}: HabitRowProps) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [isTouchMove, setIsTouchMove] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    // Не реагируем на клики по интерактивным элементам
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('.habit-row__action-button');
    const isDrag = target.closest('.habit-row__drag');
    const isToggle = target.closest('.habit-row__toggle');

    if (!isActionButton && !isDrag && !isToggle) {
      setIsMouseDown(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isMouseDown) {
      // Проверяем что это был именно клик, а не выделение текста
      const target = e.target as HTMLElement;
      const isActionButton = target.closest('.habit-row__action-button');
      const isDrag = target.closest('.habit-row__drag');
      const isToggle = target.closest('.habit-row__toggle');

      if (!isActionButton && !isDrag && !isToggle) {
        handleCardToggle();
      }
    }
    setIsMouseDown(false);
  };

  const handleMouseMove = () => {
    // Если мышь двигается - это не клик
    if (isMouseDown) {
      setIsMouseDown(false);
    }
  };

  //защита от тапов при скролле
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
    setIsTouchMove(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStart.x);
    const diffY = Math.abs(touch.clientY - touchStart.y);

    // Если движение больше 10px в любую сторону - это скролл/свайп
    if (diffX > 10 || diffY > 10) {
      setIsTouchMove(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStart.time;

    if (!isTouchMove && touchDuration < 300) {
      handleCardToggle();
    }
  };

  const handleCardToggle = () => {
    if (isActive) {
      onDeactivate();
    } else {
      onActivate();
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

  //закрытие по клику снаружи
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
        onDeactivate();
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, onDeactivate]);

  return (
    <article
      ref={rowRef}
      className={clsx('habit-row', `row-${habit.rating}`, { 'habit-row--active': isActive })}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsMouseDown(false)}
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
