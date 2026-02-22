import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { EmptyState } from '@/components/EmptyState';
import { HabitList } from '@/components/HabitList';
import { generateNewHabitName } from '@/utils/habitUtils';
import type { HabitItem } from '@/types/habits';
import { DeleteAll } from '@/components/DeleteAll';

function App() {
  const { theme, switchTheme } = useTheme();
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
        <h1 className="semantic-heading">Карта привычек</h1>
        <ThemeToggle currentTheme={theme} onThemeToggle={switchTheme} />
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
        <DeleteAll onDeleteAll={cleanAllHabits} />
      </section>
    </>
  );
}

export default App;
