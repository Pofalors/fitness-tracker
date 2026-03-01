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
    you: 'Εσύ',

    // Login
    loginMessage: 'Παρακολούθησε τις προπονήσεις σου και πέτυχε τους στόχους σου!',
    free: 'Δωρεάν',
    
    // Navigation
    home: 'Αρχική',
    track: 'Καταγραφή',
    history: 'Ιστορικό',
    statistics: 'Στατιστικά',
    profile: 'Προφίλ',

    // Notifications
    notifications: 'Ειδοποιήσεις',
    markAllRead: 'Ανάγνωση όλων',
    noNotifications: 'Δεν υπάρχουν ειδοποιήσεις',
    
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
    mins: 'λεπτά',
    viewAll: 'Δες όλες',
    weeklyGoal: 'Εβδομαδιαίος στόχος',
    recentAchievements: 'Πρόσφατα επιτεύγματα',
    friendsActivity: 'Δραστηριότητα φίλων',
    viewProgress: 'Δες την πρόοδό σου',
    noActiveChallenges: 'Δεν υπάρχουν ενεργές προκλήσεις!',
    browseChallenges: 'Δες τις προκλήσεις',
    workedOut: 'Έκανε',
    noActivity: 'Καμία δραστηριότητα',
    noFriends: 'Δεν ακολουθείς κανέναν ακόμα',
    findFriends: 'Βρες φίλους',
    firstWorkout: 'Πρώτη προπόνηση',
    workouts: 'προπονήσεις',
    newQuote: 'Νέο απόφθεγμα',
    athlete: 'Αθλητής',
    champion: 'Πρωταθλητής',
    runner: 'Δρομέας',
    yogi: 'Γιόγκι',
    
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
    unknownDate: 'Άγνωστη ημερομηνία',

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
    bio: 'Βιογραφικό',
    editBio: 'Επεξεργασία βιογραφικού',
    uploading: 'Ανέβασμα...',
    uploadPhoto: 'Ανέβασμα φωτογραφίας',
    photoUpdated: 'Η φωτογραφία ενημερώθηκε!',
    bioUpdated: 'Το βιογραφικό ενημερώθηκε!',
    bioPlaceholder: 'Γράψε λίγα λόγια για εσένα...',
    noBio: 'Δεν υπάρχει βιογραφικό ακόμα...',
    saveError: 'Σφάλμα στην αποθήκευση',
    searchPlaceholder: 'Αναζήτηση με email ή όνομα...',

    // Social
    search: 'Αναζήτηση',
    searchError: 'Σφάλμα αναζήτησης',
    noUsersFound: 'Δεν βρέθηκαν χρήστες',
    unfollow: 'Ακολουθείς',
    follow: 'Ακολούθησε',
    totalMinutes: 'Σύνολο λεπτών',
    totalDistance: 'Σύνολο χλμ',
    noSuggestions: 'Δεν υπάρχουν προτάσεις',
    suggestedForYou: 'Προτεινόμενοι για εσένα',
    followed: 'Ακολούθησες',
    noFollowers: 'Δεν υπάρχουν ακόλουθοι',
    noFollowing: 'Δεν ακολουθείς κανέναν',

    // Challenges
    challenges: 'Προκλήσεις',
    activeChallenges: 'Ενεργές Προκλήσεις',
    completedChallenges: 'Ολοκληρωμένες',
    availableChallenges: 'Διαθέσιμες Προκλήσεις',
    yoga30Days: '30 μέρες Γιόγκα',
    yoga30DaysDesc: 'Κάνε γιόγκα για 30 συνεχόμενες ημέρες',
    running100km: '100 χιλιόμετρα τρέξιμο',
    running100kmDesc: 'Συμπλήρωσε 100 χιλιόμετρα τρεξίματος',
    gymStreak: '7 μέρες Γυμναστική',
    gymStreakDesc: 'Προπονήσου για 7 συνεχόμενες ημέρες',
    join: 'Συμμετοχή',
    joined: 'Συμμετέχεις',
    completedOn: 'Ολοκληρώθηκε στις',
    challengeStarted: 'Ξεκίνησες το challenge: ',
    cancelChallenge: 'Ακύρωση',
    cancelConfirm: 'Θα χάσεις όλη την πρόοδο του challenge. Συνέχεια;',
    cancelConfirmed: 'Ακύρωσες το challenge',
    challengeCompleted: '🎉 Ολοκλήρωσες το challenge: ',
    challengeCancelled: 'Challenge ακυρώθηκε',
    
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
    you: 'You',

    // Login
    loginMessage: 'Track your workouts and achieve your goals!',
    free: 'Free',
    
    // Navigation
    home: 'Home',
    track: 'Track',
    history: 'History',
    statistics: 'Statistics',
    profile: 'Profile',

    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    
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
    mins: 'mins',
    viewAll: 'View all',
    weeklyGoal: 'Weekly goal',
    recentAchievements: 'Recent Achievements',
    friendsActivity: 'Friends Activity',
    viewProgress: 'View progress',
    noActiveChallenges: 'No active challenges!',
    browseChallenges: 'Browse challenges',
    workedOut: 'worked out',
    noActivity: 'No activity',
    noFriends: 'You are not following anyone yet',
    findFriends: 'Find friends',
    firstWorkout: 'First workout',
    workouts: 'workouts',
    newQuote: 'New quote',
    athlete: 'Athlete',
    champion: 'Champion',
    runner: 'Runner',
    yogi: 'Yogi',
    
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
    unknownDate: 'Unknown date',

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
    bio: 'Bio',
    editBio: 'Edit bio',
    uploading: 'Uploading...',
    uploadPhoto: 'Upload photo',
    photoUpdated: 'Photo updated successfully!',
    bioUpdated: 'Bio updated successfully!',
    bioPlaceholder: 'Write something about yourself...',
    noBio: 'No bio yet...',
    saveError: 'Error saving bio. Please try again.',
    searchPlaceholder: 'Search by email or name...',

    // Social
    search: 'Search',
    searchError: 'Error searching users. Please try again.',
    noUsersFound: 'No users found',
    unfollow: 'Following',
    follow: 'Follow',
    totalMinutes: 'Total minutes',
    totalDistance: 'Total km',
    noSuggestions: 'No suggestions available',
    suggestedForYou: 'Suggested for you',
    followed: 'You followed',
    noFollowers: 'No followers yet',
    noFollowing: 'Not following anyone yet',

    // Challenges
    challenges: 'Challenges',
    activeChallenges: 'Active Challenges',
    completedChallenges: 'Completed',
    availableChallenges: 'Available Challenges',
    yoga30Days: '30 Days of Yoga',
    yoga30DaysDesc: 'Do yoga for 30 consecutive days',
    running100km: '100km Running',
    running100kmDesc: 'Complete 100km of running',
    gymStreak: '7 Days Gym Streak',
    gymStreakDesc: 'Workout for 7 consecutive days',
    join: 'Join',
    joined: 'Joined',
    completedOn: 'Completed on',
    challengeStarted: 'You joined the challenge: ',
    cancelChallenge: 'Cancel',
    cancelConfirm: 'You will lose all challenge progress. Continue?',
    cancelConfirmed: 'You cancelled the challenge',
    challengeCompleted: '🎉 Challenge completed: ',
    challengeCancelled: 'Challenge cancelled',
    
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