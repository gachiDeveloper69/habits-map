import { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { EmptyState } from '@/components/EmptyState';
import { HabitList } from '@/components/HabitList';
import { generateNewHabitName } from '@/utils/habitUtils';

function App() {
  const { theme, switchTheme } = useTheme();
  const { habits, createHabit, deleteHabit } = useHabits();

  const handleCreateHabit = () => {
    const title = generateNewHabitName(habits);
    try {
      createHabit({ title });
    } catch (e) {
      throw new Error(`Failed to add new habit: ${e}`);
    }
  };

  const handleCreateHabitWithIndex = (index: number) => {
    const title = generateNewHabitName(habits);
    try {
      createHabit({ title }, index);
    } catch (e) {
      throw new Error(`Failed to add new habit: ${e}`);
    }
  };

  const handleDeleteHabit = (id: string) => {
    try {
      deleteHabit(id);
    } catch (e) {
      throw new Error(`Failed to delete habit by id: ${id} with error: ${e}`);
    }
  };
  return (
    <>
      <section className="page">
        <h1 className="semantic-heading">Карта привычек</h1>
        <ThemeToggle currentTheme={theme} onThemeToggle={switchTheme} />
        <div className="container">
          {habits.length > 0 ? (
            <HabitList
              habits={habits}
              onAddSideBy={handleCreateHabitWithIndex}
              onHabitDelete={handleDeleteHabit}
            />
          ) : (
            <EmptyState onHabitCreate={handleCreateHabit} />
          )}
        </div>
      </section>
    </>
  );
}

export default App;
