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
    date: 'Ημερομηνία',
    loading: 'Φόρτωση...',
    errorTraining: 'Η προπόνηση πρέπει να έχει διάρκεια',
    success: 'Η προπόνηση καταγράφηκε επιτυχώς!',
    error: 'Υπήρξε ένα σφάλμα. Προσπάθησε ξανά.',
    followers: 'Ακόλουθοι',
    following: 'Ακολουθείτε',
    addComment: 'Προσθήκη σχολίου...',
    post: 'Δημοσίευση',

    // Login
    loginMessage: 'Παρακολούθησε τις προπονήσεις σου και πέτυχε τους στόχους σου!',
    free: 'Δωρεάν',
    
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
    days: 'μέρες',
    viewAll: 'Δες όλες',
    
    // Track Workout
    workoutType: 'Τύπος Προπόνησης',
    distance: 'Απόσταση (km)',
    distancePlaceholder: 'π.χ. 5.2',
    notes: 'Σημειώσεις (προαιρετικό)',
    notesPlaceholder: 'Πως ηταν η προπόνηση σημερα;',
    running: 'Τρέξιμο',
    gym: 'Γυμναστική',
    yoga: 'Γιόγκα',
    walking: 'Περπάτημα',
    other: 'Άλλο',
    saving: 'Αποθήκευση...',
    savedTraining: 'Η προπόνηση αποθηκεύτηκε επιτυχώς!',

    // Stopwatch
    start: 'Έναρξη',
    stop: 'Σταμάτημα',
    reset: 'Επαναφορά',

    // History
    all: 'Όλες',
    week: 'Τελευταία εβδομάδα',
    month: 'Τελευταίος μήνας',
    noTraining: 'Δεν βρέθηκαν προπονήσεις',
    startTracking: 'Ξεκίνα καταγράφοντας την πρώτη σου προπόνηση!',
    newTraining: '+ Νέα Προπόνηση',
    summary: 'Σύνοψη',
    totalTrainings: 'Σύνολο προπονήσεων',
    totalTime: 'Συνολικός χρόνος',
    hours: 'ώρες',

    // Statistics
    minutes: 'Λεπτά',
    kilometers: 'Χιλιόμετρα',
    avgDuration: 'Μ.Ο. διάρκεια',
    min: 'λ',
    workoutsPerDay: 'Προπονήσεις ανά ημέρα',
    workoutTypes: 'Τύποι προπονήσεων',
    personalRecords: 'Προσωπικά Records',
    longestDuration: 'Μεγαλύτερη διάρκεια',
    longestDistance: 'Μεγαλύτερη απόσταση',
    total: 'Σύνολο',
    
    // Profile
    myProfile: 'Το Προφίλ μου',
    totalWorkouts: 'Σύνολο',
    badges: 'Badges & Επιτεύγματα',
    badgesMessage: 'Κάνε περισσότερες προπονήσεις για να κερδίσεις badges!',
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
    date: 'Date',
    loading: 'Loading...',
    errorTraining: 'The training must have duration',
    success: 'Workout logged successfully!',
    error: 'An error occurred. Please try again.',
    followers: 'Followers',
    following: 'Following',
    addComment: 'Add comment...',
    post: 'Post',

    // Login
    loginMessage: 'Track your workouts and achieve your goals!',
    free: 'Free',
    
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
    days: 'days',
    viewAll: 'View all',
    
    // Track Workout
    workoutType: 'Workout Type',
    distance: 'Distance (km)',
    distancePlaceholder: 'ex: 5.2',
    notes: 'Notes (optional)',
    notesPlaceholder: 'How was your workout today?',
    running: 'Running',
    gym: 'Gym',
    yoga: 'Yoga',
    walking: 'Walking',
    other: 'Other',
    saving: 'Saving...',
    savedTraining: 'Workout saved successfully!',

    // Stopwatch
    start: 'Start',
    stop: 'Stop',
    reset: 'Reset',

    // History
    all: 'All',
    week: 'Last week',
    month: 'Last month',
    noTraining: 'No workouts found',
    startTracking: 'Start tracking your first workout!',
    newTraining: '+ New Workout',
    summary: 'Summary',
    totalTrainings: 'Total trainings',
    totalTime: 'Total time',
    hours: 'hours',

    // Statistics
    minutes: 'Minutes',
    kilometers: 'Kilometers',
    avgDuration: 'Avg duration',
    min: 'min',
    workoutsPerDay: 'Workouts per day',
    workoutTypes: 'Workout types',
    personalRecords: 'Personal Records',
    longestDuration: 'Longest duration',
    longestDistance: 'Longest distance',
    total: 'Total',
    
    // Profile
    myProfile: 'My Profile',
    totalWorkouts: 'Total',
    badges: 'Badges',
    badgesMessage: 'Do more workouts to earn badges!',
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