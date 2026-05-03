import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  token: string;
}

interface StoreState {
  user: User | null;
  activeWorkoutStart: string | null;
  setUser: (user: User | null) => void;
  startWorkout: () => void;
  finishWorkout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      activeWorkoutStart: null,
      setUser: (user) => set({ user }),
      startWorkout: () => set({ activeWorkoutStart: new Date().toISOString() }),
      finishWorkout: () => set({ activeWorkoutStart: null }),
    }),
    {
      name: 'strevo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
