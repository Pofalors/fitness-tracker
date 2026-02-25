export type WorkoutType = 'running' | 'gym' | 'yoga' | 'walking' | 'other';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Workout {
  id?: string;
  userId: string;
  type: WorkoutType;
  date: Date;
  duration: number; // σε δευτερόλεπτα
  distance?: number; // σε km
  calories?: number;
  exercises?: Exercise[];
  notes?: string;
  createdAt?: Date;
}

export interface WorkoutFormData {
  type: WorkoutType;
  date: string;
  duration: number;
  distance?: number;
  notes?: string;
}