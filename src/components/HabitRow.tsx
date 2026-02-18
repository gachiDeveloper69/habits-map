import type { HabitItem } from '@/types/habits';
import clsx from 'clsx';
import DragHandle from '@/icons/drag-handle.svg?react';
import MockToggle from '@/icons/mock-toggle.svg?react';
import type { HabitRowControlsState } from '@/components/HabitRowControls';

import { HabitRowControls } from '@/components/HabitRowControls';

import { useEffect, useRef, useState } from 'react';

interface HabitRowProps {
  habit: HabitItem;
  isActive: boolean;
  // isEditing: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  // onStartEdit: () => void;
  // onCancelEdit: () => void;
  // onCommitEdit: (newTitle: string) => void;
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

  const controlsState = (): HabitRowControlsState => {
    if (isActive) return 'active';
    return 'inactive';
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
      <div className="habit-row__title" title={habit.title}>
        {habit.title}
      </div>
      <div onPointerDown={handleToggleClick} className="habit-row__toggle">
        <MockToggle />
      </div>

      {/* CONTROLS */}
      <HabitRowControls
        state={controlsState()}
        onAddAbove={onAddAbove}
        onAddBelow={onAddBelow}
        onDelete={onDelete}
        onDeactivate={onDeactivate}
      />
    </article>
  );
}
