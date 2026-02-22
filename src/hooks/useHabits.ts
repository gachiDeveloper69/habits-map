import { v4 as uuidv4 } from 'uuid';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { HabitItem, CreateHabitData } from '@/types/habits';
import { HABIT_CONSTANTS } from '@/constants/habitConstants';
import { normalizeHabits, addToHabitsArray } from '@/utils/habitUtils';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<HabitItem[]>(HABIT_CONSTANTS.storageKey, []);

  const createHabit = (
    { title, rating = 'neutral' }: CreateHabitData,
    index?: number
  ): string | undefined => {
    const normalizedTitle = title.trim().toLowerCase();
    if (normalizedTitle.trim() === '') {
      throw new Error('Название не может быть пустым');
    }
    const names = habits.map(habit => habit.title.trim().toLowerCase());
    if (names.includes(normalizedTitle)) {
      throw new Error(`Уже есть привычка ${title}`);
    }
    try {
      const newHabit: HabitItem = {
        id: uuidv4(),
        title: title,
        rating: rating,
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setHabits(prevHabits => addToHabitsArray(prevHabits, newHabit, index));
      return newHabit.id;
    } catch (error) {
      console.log(`Error adding habit "${title}":`, error);
      throw error;
    }
  };

  const updateHabit = (id: string, updates: Partial<Pick<HabitItem, 'rating' | 'title'>>) => {
    const currentHabit = habits.find(h => h.id === id);
    const normalizedTitle = updates.title?.trim().toLowerCase();
    if (!currentHabit) {
      throw new Error(`Не удалось найти привычку по id: "${id}" `);
    }

    try {
      let changes = {};

      if (normalizedTitle && normalizedTitle.trim() !== '') {
        const names = habits
          .filter(habit => habit.id !== id)
          .map(habit => habit.title.trim().toLowerCase());
        if (names.includes(normalizedTitle)) {
          throw new Error(`Уже есть привычка ${updates.title}`);
        }

        const title = updates.title?.trim();
        changes = { ...changes, title };
      }

      if (updates.rating) {
        const rating = updates.rating;
        changes = { ...changes, rating };
      }

      if (Object.keys(changes).length > 0) {
        const updatedAt = Date.now();
        changes = { ...changes, updatedAt };
        setHabits(prevHabits => {
          //
          return prevHabits.map(habit => {
            return habit.id === id ? { ...habit, ...changes } : habit;
          });
        });
      }
    } catch (error) {
      console.log(`Error editing habit "${currentHabit?.title || id}":`, error);
      throw error;
    }
  };

  const moveHabit = (id: string, toIndex: number) => {
    const currentHabit = habits.find(h => h.id === id);
    if (!currentHabit) {
      throw new Error(`Не удалось найти привычку по id: "${id}" `);
    }

    setHabits(prevHabits =>
      addToHabitsArray(
        prevHabits.filter(habit => habit.id !== id),
        { ...currentHabit, updatedAt: Date.now() },
        toIndex
      )
    );
  };

  const deleteHabit = (id: string) => {
    const currentHabit = habits.find(h => h.id === id);
    if (!currentHabit) {
      throw new Error(`Не удалось найти привычку по id: "${id}" `);
    }

    //убираем из массива
    setHabits(prevHabits => normalizeHabits(prevHabits.filter(habit => habit.id !== id)));
  };

  const cleanAllHabits = () => {
    setHabits([]);
  };

  return {
    habits,
    createHabit,
    updateHabit,
    moveHabit,
    deleteHabit,
    cleanAllHabits,
  };
}
