import type { HabitItem } from '@/types/habits';
import { HabitRow } from '@/components/HabitRow';
import { useState, useRef, useEffect } from 'react';

interface HabitListProps {
  habits: HabitItem[];
  onHabitDelete: (id: string) => void;
  onAddSideBy: (index: number) => void;
}

export function HabitList({ habits, onHabitDelete, onAddSideBy }: HabitListProps) {
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const rowRef = useRef<HTMLElement>(null);

  const handleActivate = (id: string) => {
    setActiveHabitId(prev => (prev === id ? null : id));
  };

  const handleDeactivate = () => {
    setActiveHabitId(null);
  };

  useEffect(() => {
    const handlePointerOutside = (e: PointerEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        handleDeactivate();
      }
    };
    if (activeHabitId !== null) {
      document.addEventListener('pointerdown', handlePointerOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handlePointerOutside);
    };
  }, [activeHabitId]);

  return (
    <section className="habit-list" ref={rowRef}>
      {habits.map(h => (
        <HabitRow
          key={h.id}
          habit={h}
          isActive={activeHabitId === h.id}
          onActivate={() => handleActivate(h.id)}
          onDeactivate={handleDeactivate}
          onAddAbove={() => onAddSideBy(h.order)}
          onAddBelow={() => onAddSideBy(h.order + 1)}
          onDelete={() => onHabitDelete(h.id)}
        />
      ))}
    </section>
  );
}
