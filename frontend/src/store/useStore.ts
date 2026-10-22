import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreState, User, Workout, View, StoryData } from '../types';

const MOCK_WORKOUTS: Workout[] = [
  { id: '1', type: 'Chest & Triceps', duration: 3720, calories: 420, intensity: 'high', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: '2', type: 'Outdoor Running', duration: 2540, calories: 340, intensity: 'extreme', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '3', type: 'Legs & Core', duration: 4320, calories: 510, intensity: 'high', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: '4', type: 'Back & Biceps', duration: 3400, calories: 390, intensity: 'moderate', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '5', type: 'Vinyasa Yoga', duration: 2700, calories: 210, intensity: 'low', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '6', type: 'Shoulders & Traps', duration: 3100, calories: 360, intensity: 'moderate', createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: '7', type: 'HIIT Cardio', duration: 2100, calories: 380, intensity: 'extreme', createdAt: new Date(Date.now() - 11 * 86400000).toISOString() },
  { id: '8', type: 'Cycling Sprint', duration: 5100, calories: 620, intensity: 'high', createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      workouts: MOCK_WORKOUTS,
      activeWorkoutStart: null,
      activeStoryData: null,
      streak: 6,
      bestStreak: 14,
      currentView: 'auth' as View,

      setUser: (user: User | null) =>
        set({ user, currentView: user ? 'home' : 'auth' }),

      addWorkout: (workout: Workout) =>
        set((state) => ({
          workouts: [workout, ...state.workouts],
          streak: state.streak + 1,
          bestStreak: Math.max(state.bestStreak, state.streak + 1),
        })),

      startWorkout: () =>
        set({ activeWorkoutStart: new Date().toISOString(), currentView: 'active-workout' }),

      finishWorkout: () =>
        set({ activeWorkoutStart: null }),

      setStoryData: (data: StoryData | null) =>
        set({ activeStoryData: data }),

      setView: (view: View) => set({ currentView: view }),

      setStreak: (current: number, best: number) =>
        set({ streak: current, bestStreak: best }),
    }),
    {
      name: 'strevo-web-storage',
    }
  )
);
