import { writable } from 'svelte/store';
import type { Habit } from '../types';

function createHabitStore() {
  const { subscribe, set, update } = writable<Record<string, Habit[]>>({});

  return {
    subscribe,
    
    updateSlot: (slotKey: string, habits: Habit[]) => {
      update(store => {
        const newStore = {
          ...store,
          [slotKey]: habits
        };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitWeekData', JSON.stringify(newStore));
        }
        return newStore;
      });
    },
    
    loadFromStorage: () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('habitWeekData');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            set(data);
          } catch (e) {
            console.error('Failed to load habits from storage:', e);
          }
        }
      }
    },
    
    clear: () => {
      set({});
      if (typeof window !== 'undefined') {
        localStorage.removeItem('habitWeekData');
      }
    }
  };
}

export const habitStore = createHabitStore();