export type HabitRating = 'plus' | 'minus' | 'neutral';

export interface HabitItem {
  id: string;
  title: string;
  rating: HabitRating;
  order: number;
  createdAt: number;
  updatedAt?: number;
}

export type CreateHabitData = {
  title: string;
  rating?: HabitRating;
};
