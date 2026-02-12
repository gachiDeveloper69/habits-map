import type { HabitItem } from '@/types/habits';

/**
 * Normalizes habits array - 0-based indexes, 1-step
 * @param habits array sorted by asc HabitItem.index
 * @returns re-indexed habits array
 * input aray MUST be sorted for correct work!!!
 */
export function normalizeHabits(habits: HabitItem[]): HabitItem[] {
  if (habits.length === 0) {
    return habits;
  }
  const normalized: HabitItem[] = [];

  for (let i = 0; i < habits.length; i++) {
    const newHabit: HabitItem = {
      ...habits[i],
      order: i,
    };
    normalized.push(newHabit);
  }

  return normalized;
}

/**
 * Adds new HabitItem object to array on specific index or to the end
 * @param array - current array of habits
 * @param item - habit to insert
 * @param index - if passed, item will be inserted on this index of array
 * @returns re-indexed habits array with new item
 */
export function addToHabitsArray(array: HabitItem[], item: HabitItem, index?: number): HabitItem[] {
  const ordered = [...array];
  ordered.sort((a, b) => a.order - b.order);

  if (index !== undefined && index < 0) {
    index = 0;
  }

  if (index === undefined || index > ordered.length) {
    return normalizeHabits([...ordered, item]);
  } else {
    const before = ordered.slice(0, index);
    const after = ordered.slice(index);
    return normalizeHabits([...before, item, ...after]);
  }
}
