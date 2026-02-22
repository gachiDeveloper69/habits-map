import autoAnimate from '@formkit/auto-animate';
import type { HabitItem } from '@/types/habits';
import { HabitRow } from '@/components/HabitRow';
import { SortableHabitRow } from '@/components/SortableHabitRow';
import { useState, useRef, useEffect } from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface HabitListProps {
  habits: HabitItem[];
  onHabitDelete: (id: string) => void;
  onAddSideBy: (index: number) => string | undefined;
  onHabitEdit: (id: string, updates: Partial<Pick<HabitItem, 'rating' | 'title'>>) => void;
  onHabitMove: (id: string, toIndex: number) => void;
}

export function HabitList({
  habits,
  onHabitDelete,
  onAddSideBy,
  onHabitEdit,
  onHabitMove,
}: HabitListProps) {
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const listRef = useRef<HTMLElement>(null);

  const handleStartEdit = (id: string) => {
    setActiveHabitId(id);
    setEditingHabitId(id);
  };

  const handleStopEdit = () => {
    setEditingHabitId(null);
    handleDeactivate();
  };

  const handleCommitEdit = (newTitle: string) => {
    if (!editingHabitId || editingHabitId === '') return;
    try {
      onHabitEdit(editingHabitId, { title: newTitle });
      handleDeactivate();
    } catch (e) {
      throw new Error(`failed editing habit: id ${editingHabitId}, ${e}`);
    } finally {
      setEditingHabitId(null);
    }
  };

  const handleCreateAndEdit = (index: number) => {
    const newIndex = onAddSideBy(index);
    if (newIndex !== undefined) {
      handleStartEdit(newIndex);
    }
  };

  const handleActivate = (id: string) => {
    setActiveHabitId(prev => (prev === id ? null : id));
    if (editingHabitId) {
      handleStartEdit(id);
    }
  };

  const handleDeactivate = () => {
    setActiveHabitId(null);
  };

  //обработка кликов вне активной карточки
  useEffect(() => {
    const handlePointerOutside = (e: PointerEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        handleStopEdit(); //уже деактивирует
        // handleDeactivate();
      }
    };
    if (activeHabitId !== null || editingHabitId !== null) {
      document.addEventListener('pointerdown', handlePointerOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handlePointerOutside);
    };
  }, [activeHabitId, editingHabitId]);

  //плавная анимация появления/удаления

  //DnD
  useEffect(() => {
    if (!listRef.current) return;
    autoAnimate(listRef.current, {
      duration: 260,
      easing: 'ease-in-out',
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // чтобы не начинать drag от микродвижения курсора
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart(event: DragStartEvent) {
    handleStopEdit();
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = habits.findIndex(i => i.id === active.id);
      const currentHabitId = habits[oldIndex].id;
      const newIndex = habits.findIndex(i => i.id === over.id);

      if (oldIndex !== newIndex) {
        onHabitMove(currentHabitId, newIndex);
      }
    }
  }

  return (
    <section className="habit-list" ref={listRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
          {habits.map(h => (
            <SortableHabitRow
              key={h.id}
              habit={h}
              isActive={activeHabitId === h.id}
              isEditing={editingHabitId === h.id}
              onActivate={() => handleActivate(h.id)}
              onDeactivate={handleDeactivate}
              onAddAbove={() => handleCreateAndEdit(h.order)}
              onAddBelow={() => handleCreateAndEdit(h.order + 1)}
              onDelete={() => onHabitDelete(h.id)}
              onStartEdit={() => handleStartEdit(h.id)}
              onCancelEdit={handleStopEdit}
              onCommitEdit={handleCommitEdit}
              onUpdateRating={rating => onHabitEdit(h.id, { rating })}
            />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
}
