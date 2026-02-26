import ReactGA from 'react-ga4';

// Το Measurement ID σου από το Google Analytics
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  if (import.meta.env.PROD) { // Μόνο σε production
    ReactGA.initialize(MEASUREMENT_ID);
    console.log('📊 Analytics initialized');
  }
};

export const pageView = (path: string) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

export const event = (category: string, action: string, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label
    });
  }
};

// Custom events για το fitness tracker
export const trackWorkout = (workoutType: string, duration: number) => {
  event('Workout', 'add', `${workoutType} - ${duration}s`);
};

export const trackLogin = (method: string) => {
  event('User', 'login', method);
};

export const trackAchievement = (badgeName: string) => {
  event('Achievement', 'unlock', badgeName);
};