import { create } from 'zustand';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from './authStore';
import type { Challenge, ChallengeType } from '../types/challenge.types';
import { useNotificationStore } from './notificationStore';

interface ChallengeStore {
  challenges: Challenge[];
  loading: boolean;
  fetchChallenges: () => Promise<void>;
  joinChallenge: (challenge: Omit<Challenge, 'id' | 'userId' | 'progress' | 'status'>) => Promise<void>;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  challenges: [],
  loading: false,

  fetchChallenges: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const q = query(
        collection(db, 'challenges'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      })) as Challenge[];
      
      set({ challenges, loading: false });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      set({ loading: false });
    }
  },

  joinChallenge: async (challengeData: Omit<Challenge, 'id' | 'userId' | 'progress' | 'status'>) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const challenge: Omit<Challenge, 'id'> = {
        ...challengeData,
        userId: user.uid,
        progress: 0,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + challengeData.goal * 24 * 60 * 60 * 1000) // goal μέρες
      };

      await addDoc(collection(db, 'challenges'), challenge);
      await get().fetchChallenges();
      
      useNotificationStore.getState().addNotification({
        userId: user.uid,
        fromUserId: 'system',
        type: 'achievement',
        message: `Ξεκίνησες το challenge: ${challengeData.title}!`,
        link: '/profile'
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  },

  updateProgress: async (challengeId: string, progress: number) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, { progress });
      
      // Check if completed
      const challenge = get().challenges.find(c => c.id === challengeId);
      if (challenge && progress >= challenge.goal) {
        await get().completeChallenge(challengeId);
      } else {
        await get().fetchChallenges();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },

  completeChallenge: async (challengeId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        status: 'completed',
        completedAt: new Date()
      });
      
      await get().fetchChallenges();
      
      const challenge = get().challenges.find(c => c.id === challengeId);
      useNotificationStore.getState().addNotification({
        userId: user.uid,
        fromUserId: 'system',
        type: 'achievement',
        message: `🎉 Ολοκλήρωσες το challenge: ${challenge?.title}!`,
        link: '/profile'
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  }
}));