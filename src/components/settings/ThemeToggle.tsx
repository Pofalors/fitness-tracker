import React, { useEffect } from 'react';
import { useThemeStore, useTheme } from '../../store/themeStore';

export const ThemeToggle = () => {
  const { theme, setTheme, applyTheme } = useTheme();
  
  useEffect(() => {
    applyTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg transition-all touch-feedback ${
          theme === 'light' 
            ? 'bg-white dark:bg-gray-600 shadow-md' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Φωτεινό"
      >
        ☀️
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg transition-all touch-feedback ${
          theme === 'dark' 
            ? 'bg-white dark:bg-gray-600 shadow-md' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Σκοτεινό"
      >
        🌙
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg transition-all touch-feedback ${
          theme === 'system' 
            ? 'bg-white dark:bg-gray-600 shadow-md' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Σύστημα"
      >
        💻
      </button>
    </div>
  );
};