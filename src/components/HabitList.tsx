import type { HabitItem } from '@/types/habits';
import { HabitRow } from '@/components/HabitRow';
import { useState } from 'react';

interface HabitListProps {
  habits: HabitItem[];
  onHabitDelete: (id: string) => void;
  onAddSideBy: (index: number) => void;
}

export function HabitList({ habits, onHabitDelete, onAddSideBy }: HabitListProps) {
  const [activeHabitId, setActiveHabitId] = useState<string | null>();

  const handleActivate = (id: string) => {
    setActiveHabitId(prev => (prev === id ? null : id));
  };

  const handleDeactivate = () => {
    setActiveHabitId(null);
  };

  return (
    <section className="habit-list">
      {habits.map(h => (
        <HabitRow
          key={h.id}
          habit={h}
          isActive={activeHabitId === h.id}
          onActivate={() => handleActivate(h.id)}
          onDeactivate={handleDeactivate}
          onAddSideBy={onAddSideBy}
          onDelete={onHabitDelete}
        />
      ))}
    </section>
  );
}
