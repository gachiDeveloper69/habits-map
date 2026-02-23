import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { EmptyState } from '@/components/EmptyState';
import { HabitList } from '@/components/HabitList';
import { generateNewHabitName } from '@/utils/habitUtils';
import type { HabitItem } from '@/types/habits';

function App() {
  const { theme, switchTheme } = useTheme();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    // подстроиться под тему Telegram (не работает - потом починить)
    // tg.colorScheme = "dark" | "light"
    if (tg.colorScheme === 'dark' && theme !== 'dark') switchTheme();
  }, []);
  const { habits, createHabit, deleteHabit, updateHabit, cleanAllHabits, moveHabit } = useHabits();

  const handleCreateHabit = (): string | undefined => {
    const title = generateNewHabitName(habits);
    try {
      return createHabit({ title });
    } catch (e) {
      throw new Error(`Failed to add new habit: ${e}`);
    }
  };

  const handleCreateHabitWithIndex = (index: number): string | undefined => {
    const title = generateNewHabitName(habits);
    try {
      return createHabit({ title }, index);
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

  const handleEditHabit = (id: string, updates: Partial<Pick<HabitItem, 'rating' | 'title'>>) => {
    updateHabit(id, updates);
  };
  return (
    <>
      <section className="page">
        <Header theme={theme} onDeleteAll={cleanAllHabits} onSwitchTheme={switchTheme} />
        <div className="container">
          {habits.length > 0 ? (
            <HabitList
              habits={habits}
              onAddSideBy={handleCreateHabitWithIndex}
              onHabitDelete={handleDeleteHabit}
              onHabitEdit={handleEditHabit}
              onHabitMove={moveHabit}
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
