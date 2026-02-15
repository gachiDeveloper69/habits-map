/**
 * Кастомный хук для работы с localStorage как с состоянием React
 *
 * @template T - тип хранимого значения
 * @param key - ключ для localStorage
 * @param initialValue - начальное значение
 * @returns кортеж [значение, функция установки]
 *
 * @example
 * const [habits, setHabits] = useLocalStorage<Task[]>('tasks', []);
 *
 * @remarks
 * - Автоматически синхронизируется с localStorage
 * - Поддерживает функциональные обновления как useState
 * - Обрабатывает ошибки парсинга
 */

import { useState, useEffect } from 'react';

//Дженерик-функция для работы с любым типом данных
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  //инициализация из хранилища при монтировании
  // useEffect(() => {
  //   try {
  //     const item = window.localStorage.getItem(key);
  //     if (item) {
  //       const parsed = JSON.parse(item);
  //       setStoredValue(parsed);
  //     }
  //   } catch (error) {
  //     console.log(`Error reading localStorage key "${key}":`, error);
  //     throw error;
  //   }
  // }, [key, initialValue]);

  //Обертка для setStoredValue которая сохраняет в localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.log(`Error setting localStorage key "${key}":`, error);
      throw error;
    }
  };

  return [storedValue, setValue] as const;
}
