import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { EmptyState } from '@/components/EmptyState';
import { HabitList } from '@/components/HabitList';
import { generateNewHabitName } from '@/utils/habitUtils';
import type { HabitItem } from '@/types/habits';

import { useLanguage } from '@/i18n/LanguageProvider';

export default function HabitsMap() {
  const { theme, switchTheme } = useTheme();
  const { t } = useLanguage();

  const baseName = t('newHabitName.default');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
  }, []);
  const { habits, createHabit, deleteHabit, updateHabit, cleanAllHabits, moveHabit } = useHabits();

  const handleCreateHabit = (): string | undefined => {
    const title = generateNewHabitName(habits, baseName);
    try {
      return createHabit({ title });
    } catch (e) {
      throw new Error(`Failed to add new habit: ${e}`);
    }
  };

  const handleCreateHabitWithIndex = (index: number): string | undefined => {
    const title = generateNewHabitName(habits, baseName);
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
