import { create } from 'zustand';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from './authStore';
import type { Follow, Like, Comment } from '../types/social.types';
import { useNotificationStore } from './notificationStore';

interface SocialStore {
  followers: Follow[];
  following: Follow[];
  likes: Like[];
  comments: Comment[];
  loading: boolean;
  
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  likeWorkout: (workoutId: string) => Promise<void>;
  unlikeWorkout: (workoutId: string) => Promise<void>;
  addComment: (workoutId: string, text: string) => Promise<void>;
  fetchSocialData: (userId: string) => Promise<void>;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  followers: [],
  following: [],
  likes: [],
  comments: [],
  loading: false,
  
  followUser: async (userId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'follows'),
        where('userId', '==', userId),
        where('followerId', '==', currentUser.uid)
      );
      
      const existingFollow = await getDocs(q);
      
      if (existingFollow.empty) {
        const follow: Omit<Follow, 'id'> = {
          userId,
          followerId: currentUser.uid,
          createdAt: new Date()
        };
        
        await addDoc(collection(db, 'follows'), follow);
        
        // NOTIFICATION ONLY FOR THE FIRST FOLLOW (NOT FOR EVERY FOLLOW)
        await useNotificationStore.getState().addNotification({
          userId: userId,
          fromUserId: currentUser.uid,
          type: 'follow',
          message: `${currentUser.displayName || 'Κάποιος'} σε ακολούθησε`,
          link: '/profile'
        });
        
        await get().fetchSocialData(currentUser.uid);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  },
  
  unfollowUser: async (userId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'follows'),
        where('userId', '==', userId),
        where('followerId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      await get().fetchSocialData(currentUser.uid);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  },
  
  likeWorkout: async (workoutId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      const like: Omit<Like, 'id'> = {
        workoutId,
        userId: currentUser.uid,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'likes'), like);

      const workoutRef = doc(db, 'workouts', workoutId);
      const workoutSnap = await getDoc(workoutRef);
      
      if (workoutSnap.exists()) {
        const workoutData = workoutSnap.data();
        if (workoutData.userId !== currentUser.uid) {
          await useNotificationStore.getState().addNotification({
            userId: workoutData.userId,
            fromUserId: currentUser.uid,
            type: 'like',
            message: `${currentUser.displayName || 'Κάποιος'} του άρεσε η προπόνησή σου`,
            link: '/history'
          });
        }
      }
      
      set((state) => ({
        likes: [...state.likes, {
          id: 'temp-' + Date.now(),
          workoutId,
          userId: currentUser.uid,
          createdAt: new Date()
        }]
      }));
      
    } catch (error) {
      console.error('Error liking workout:', error);
    }
  },
  
  unlikeWorkout: async (workoutId: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'likes'),
        where('workoutId', '==', workoutId),
        where('userId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      set((state) => ({
        likes: state.likes.filter(l => !(l.workoutId === workoutId && l.userId === currentUser.uid))
      }));
    } catch (error) {
      console.error('Error unliking workout:', error);
    }
  },
  
  addComment: async (workoutId: string, text: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      const comment: Omit<Comment, 'id'> = {
        workoutId,
        userId: currentUser.uid,
        text,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'comments'), comment);
    
      const newComment = {
        id: docRef.id,
        ...comment
      };
      
      set((state) => ({
        comments: [...state.comments, {
          id: docRef.id,
          workoutId,
          userId: currentUser.uid,
          text,
          createdAt: new Date()
        }]
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },
  
  fetchSocialData: async (userId: string) => {
    set({ loading: true });
    try {
      // Fetch followers
      const followersQuery = query(
        collection(db, 'follows'),
        where('userId', '==', userId)
      );
      const followersSnap = await getDocs(followersQuery);
      const followers = followersSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            followerId: data.followerId,
            createdAt: data.createdAt?.toDate() || new Date()
        } as Follow;
        });
      
      // Fetch following
      const followingQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId)
      );
      const followingSnap = await getDocs(followingQuery);
      const following = followingSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            followerId: data.followerId,
            createdAt: data.createdAt?.toDate() || new Date()
        } as Follow;
        });
        
        //Fetch likes
        const likesQuery = query(collection(db, 'likes'));
        const likesSnap = await getDocs(likesQuery);
        const likes = likesSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            workoutId: data.workoutId,
            userId: data.userId,
            createdAt: data.createdAt?.toDate() || new Date()
          } as Like;
        });
        
        //Fetch comments
        const commentsQuery = query(collection(db, 'comments'));
        const commentsSnap = await getDocs(commentsQuery);
        const comments = commentsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            workoutId: data.workoutId,
            userId: data.userId,
            text: data.text,
            createdAt: data.createdAt?.toDate() || new Date()
          } as Comment;
        });
        
        set({ followers, following, likes, comments, loading: false });
    } catch (error) {
      console.error('Error fetching social data:', error);
      set({ loading: false });
    }
  }
}));