import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Workout, WorkoutFormData } from '../types/workout.types';
import { useAuthStore } from './authStore';
import { trackWorkout } from '../services/analytics';

interface WorkoutStore {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (workout: WorkoutFormData) => Promise<void>;
  fetchUserWorkouts: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  loading: false,
  
  addWorkout: async (workoutData: WorkoutFormData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ loading: true });
    try {
      const workout: Omit<Workout, 'id'> = {
        ...workoutData,
        userId: user.uid,
        date: new Date(),
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'workouts'), workout);

      trackWorkout(workoutData.type, workoutData.duration);
      
      // Refresh workouts list
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef, 
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedWorkouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workout[];
      
      set({ workouts: fetchedWorkouts, loading: false });
    } catch (error) {
      console.error('Error adding workout:', error);
      set({ loading: false });
    }
  },
  
  fetchUserWorkouts: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ loading: true });
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef, 
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workout[];
      
      set({ workouts, loading: false });
    } catch (error) {
      console.error('Error fetching workouts:', error);
      set({ loading: false });
    }
  }
}));