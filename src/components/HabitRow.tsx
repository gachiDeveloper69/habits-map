import type { HabitItem, HabitRating } from '@/types/habits';
import clsx from 'clsx';
import DragHandle from '@/icons/drag-handle.svg?react';
import type { HabitRowControlsState } from '@/components/HabitRowControls';
import { HABIT_RULES } from '@/config/HabitRules';

import { HabitRowControls } from '@/components/HabitRowControls';
import { RatingToggle } from '@/components/RatingToggle';

import { useEffect, useRef, useState } from 'react';
import React from 'react';

export interface HabitRowProps {
  habit: HabitItem;
  isActive: boolean;
  isEditing: boolean;
  isDragging?: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onCommitEdit: (newTitle: string) => void;
  onUpdateRating: (rating: HabitRating) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const HabitRow = React.memo(function HabitRow({
  habit,
  isActive,
  isEditing,
  isDragging,
  onActivate,
  onDeactivate,
  onDelete,
  onAddAbove,
  onAddBelow,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
  onUpdateRating,
  dragHandleProps,
}: HabitRowProps) {
  const rowRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const pointerData = useRef({
    startX: 0,
    startY: 0,
    moved: false,
    pointerId: null as number | null,
    timerId: null as number | null,
    longPressFired: false,
  });

  const [draft, setDraft] = useState<string>(() => habit.title);
  const isTitleValid = draft.trim().length > 0;

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [isEditing]);

  const isFromDragHandle = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    return !!el.closest('.habit-row__drag');
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    if (isFromDragHandle(e)) return; //не трогаем pointerData
    if (isFromInteractive(e)) return;

    //жест только на текущий элемент
    e.currentTarget.setPointerCapture(e.pointerId);

    pointerData.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      pointerId: e.pointerId,
      timerId: null,
      longPressFired: false,
    };

    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      pointerData.current.timerId = window.setTimeout(() => {
        if (!pointerData.current.moved && pointerData.current.pointerId === e.pointerId) {
          onStartEdit();
          pointerData.current.longPressFired = true;
        }
      }, 500);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerData.current.pointerId) return;
    if (isFromDragHandle(e)) return; // и тут тоже, чтобы не активировало
    if (isFromInteractive(e)) return;

    const threshold = 10;
    const trackX = Math.abs(pointerData.current.startX - e.clientX);
    const trackY = Math.abs(pointerData.current.startY - e.clientY);
    if (trackX > threshold || trackY > threshold) {
      pointerData.current.moved = true;

      if (pointerData.current.timerId) {
        clearTimeout(pointerData.current.timerId);
        pointerData.current.timerId = null;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isEditing) return;
    if (e.pointerId !== pointerData.current.pointerId) return;

    //отпускаем capture
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (pointerData.current.longPressFired) {
      if (pointerData.current.timerId) {
        clearTimeout(pointerData.current.timerId);
      }
      pointerData.current.timerId = null;
      pointerData.current.longPressFired = false;
      pointerData.current.pointerId = null;
      return;
    }

    if (pointerData.current.timerId) {
      clearTimeout(pointerData.current.timerId);
      pointerData.current.timerId = null;
    }

    if (!pointerData.current.moved) {
      isActive ? onDeactivate() : onActivate();
    }

    pointerData.current.pointerId = null;
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (e.pointerId === pointerData.current.pointerId) {
      //отпускаем capture
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      if (pointerData.current.timerId) {
        clearTimeout(pointerData.current.timerId);
        pointerData.current.timerId = null;
      }
      pointerData.current.pointerId = null;
      pointerData.current.longPressFired = false;
    }
  };

  const isFromInteractive = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    return !!el.closest('.habit-row__action-button, .habit-row__toggle, input');
  };
  /*
  const handleDragClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    // console.log('Начать перетаскивание');
  };

  const handleToggleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    // console.log('Переключить статус');
  };
*/
  const controlsState = (): HabitRowControlsState => {
    if (isEditing) return 'edit';
    else if (isActive) return 'active';
    return 'inactive';
  };

  const handleCancelEdit = () => {
    onCancelEdit();
    if (!isTitleValid) {
      setDraft(habit.title);
    }
  };

  useEffect(() => {
    if (isEditing) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleCancelEdit();
        else if (e.key === 'Enter' && isTitleValid) onCommitEdit(draft);
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [isEditing, draft, isTitleValid]);

  //сброс таймера при размонтировании
  useEffect(() => {
    return () => {
      if (pointerData.current.timerId) {
        clearTimeout(pointerData.current.timerId);
      }
    };
  }, []);

  return (
    <article
      ref={rowRef}
      className={clsx(
        'habit-row',
        `row-${habit.rating}`,
        { 'habit-row--active': isActive },
        { 'habit-row--dragging': isDragging }
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={onStartEdit}
    >
      <div className="habit-row__drag" {...(dragHandleProps ?? {})}>
        {/*  */}
        <DragHandle />
      </div>
      {isEditing ? (
        <input
          className={clsx('habit-row__title', 'habit-row__title--input')}
          ref={titleRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          aria-label="Название привычки"
          maxLength={HABIT_RULES.title.max}
        />
      ) : (
        <div className="habit-row__title" title={habit.title}>
          {habit.title}
        </div>
      )}

      {/* TOGGLE */}
      <RatingToggle
        expanded={isActive && !isEditing}
        rating={habit.rating}
        groupId={habit.id}
        onChange={onUpdateRating}
      />

      {/* <div onPointerDown={handleToggleClick} className="habit-row__toggle">
        <MockToggle />
      </div> */}

      {/* CONTROLS */}
      <HabitRowControls
        state={controlsState()}
        applyEnabled={isTitleValid}
        onAddAbove={onAddAbove}
        onAddBelow={onAddBelow}
        onDelete={onDelete}
        onDeactivate={onDeactivate}
        onStartEdit={onStartEdit}
        onCancelEdit={handleCancelEdit}
        onCommitEdit={() => onCommitEdit(draft)}
      />
    </article>
  );
});
