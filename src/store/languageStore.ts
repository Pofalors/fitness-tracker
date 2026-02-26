import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'el' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'el', // Default: Ελληνικά
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);

// Λεξικό με όλα τα κείμενα
export const translations = {
  el: {
    // Γενικά
    appName: 'Fitness Tracker',
    back: 'Πίσω',
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    delete: 'Διαγραφή',
    edit: 'Επεξεργασία',
    
    // Navigation
    home: 'Αρχική',
    track: 'Καταγραφή',
    history: 'Ιστορικό',
    statistics: 'Στατιστικά',
    profile: 'Προφίλ',
    
    // Dashboard
    welcome: 'Καλώς ήρθες',
    today: 'Σημερινές',
    streak: 'Σερί ημερών',
    goal: 'Στόχος εβδομάδας',
    quickActions: 'Γρήγορες Ενέργειες',
    recentActivity: 'Πρόσφατη Δραστηριότητα',
    noWorkouts: 'Δεν υπάρχουν ακόμα προπονήσεις',
    startFirst: 'Ξεκίνα καταγράφοντας την πρώτη σου προπόνηση!',
    
    // Workout types
    running: 'Τρέξιμο',
    gym: 'Γυμναστική',
    yoga: 'Γιόγκα',
    walking: 'Περπάτημα',
    other: 'Άλλο',
    
    // Profile
    myProfile: 'Το Προφίλ μου',
    totalWorkouts: 'Σύνολο',
    badges: 'Badges & Επιτεύγματα',
    weeklyGoals: 'Στόχοι Εβδομάδας',
    workoutsPerWeek: 'Προπονήσεις ανά εβδομάδα',
    minutesPerWeek: 'Λεπτά προπόνησης ανά εβδομάδα',
    settings: 'Ρυθμίσεις',
    logout: 'Αποσύνδεση',
    confirmLogout: 'Θέλεις σίγουρα να αποσυνδεθείς;',
    
    // Settings
    appearance: 'Εμφάνιση',
    language: 'Γλώσσα',
    theme: 'Θέμα',
    light: 'Φωτεινό',
    dark: 'Σκοτεινό',
    system: 'Σύστημα',
  },
  en: {
    // General
    appName: 'Fitness Tracker',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    
    // Navigation
    home: 'Home',
    track: 'Track',
    history: 'History',
    statistics: 'Statistics',
    profile: 'Profile',
    
    // Dashboard
    welcome: 'Welcome',
    today: 'Today',
    streak: 'Day streak',
    goal: 'Weekly goal',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    noWorkouts: 'No workouts yet',
    startFirst: 'Start by logging your first workout!',
    
    // Workout types
    running: 'Running',
    gym: 'Gym',
    yoga: 'Yoga',
    walking: 'Walking',
    other: 'Other',
    
    // Profile
    myProfile: 'My Profile',
    totalWorkouts: 'Total',
    badges: 'Badges',
    weeklyGoals: 'Weekly Goals',
    workoutsPerWeek: 'Workouts per week',
    minutesPerWeek: 'Minutes per week',
    settings: 'Settings',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    
    // Settings
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }
};

// Hook για μετάφραση
export const useTranslation = () => {
  const { language } = useLanguageStore();
  const t = (key: keyof typeof translations.el) => {
    return translations[language][key] || key;
  };
  return { t, language };
};