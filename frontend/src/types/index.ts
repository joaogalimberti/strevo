export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  avatar?: string;
  weight?: number;
  height?: number;
}

export interface Workout {
  id: string;
  type: string;
  duration: number; // in seconds
  createdAt: string;
  intensity?: 'low' | 'moderate' | 'high' | 'extreme';
  calories?: number;
  notes?: string;
  photoUrl?: string;
}

export interface StoryData {
  workoutId: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  photoUrl?: string | null;
  streak: number;
}

export interface StoreState {
  user: User | null;
  workouts: Workout[];
  activeWorkoutStart: string | null;
  activeStoryData: StoryData | null;
  streak: number;
  bestStreak: number;
  currentView: View;
  setUser: (user: User | null) => void;
  addWorkout: (workout: Workout) => void;
  startWorkout: () => void;
  finishWorkout: () => void;
  setStoryData: (data: StoryData | null) => void;
  setView: (view: View) => void;
  setStreak: (current: number, best: number) => void;
}

export type View =
  | 'auth'
  | 'home'
  | 'active-workout'
  | 'finish-workout'
  | 'calendar'
  | 'profile'
  | 'story-preview';
