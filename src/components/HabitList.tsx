import autoAnimate from '@formkit/auto-animate';
import type { HabitItem } from '@/types/habits';
import { HabitRow } from '@/components/HabitRow';
import { useState, useRef, useEffect } from 'react';

interface HabitListProps {
  habits: HabitItem[];
  onHabitDelete: (id: string) => void;
  onAddSideBy: (index: number) => string | undefined;
  onHabitEdit: (id: string, updates: Partial<Pick<HabitItem, 'rating' | 'title'>>) => void;
}

export function HabitList({ habits, onHabitDelete, onAddSideBy, onHabitEdit }: HabitListProps) {
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

  useEffect(() => {
    if (!listRef.current) return;
    autoAnimate(listRef.current, {
      duration: 260,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <section className="habit-list" ref={listRef}>
      {habits.map(h => (
        <HabitRow
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
    </section>
  );
}
