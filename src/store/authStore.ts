import { create } from 'zustand';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { trackLogin } from '../services/analytics';

interface AuthStore {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      console.log('Προσπάθεια σύνδεσης με Google...');
      const result = await signInWithPopup(auth, provider);
      trackLogin('google');
      console.log('Επιτυχής σύνδεση:', result.user.email);
      
      // Μην κάνεις set user εδώ - το onAuthStateChanged θα το κάνει
      
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Το popup έκλεισε από τον χρήστη');
      } else if (error.code === 'auth/popup-blocked') {
        console.log('Το popup μπλοκαρίστηκε');
        alert('Παρακαλώ επέτρεψε τα popup για να συνδεθείς');
      } else {
        console.error('Σφάλμα σύνδεσης:', error);
      }
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth);
      console.log('Αποσύνδεση επιτυχής');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
  
  setUser: (user) => {
    console.log('User state changed:', user?.email || 'No user');
    set({ user });
  },
  setLoading: (loading) => set({ loading })
}));

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  console.log('🔥 Auth state changed:', user?.email || 'Logged out');
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setLoading(false);
});