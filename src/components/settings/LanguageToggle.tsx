import React from 'react';
import { useLanguageStore } from '../../store/languageStore';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
      <button
        onClick={() => setLanguage('el')}
        className={`px-3 py-1 rounded-lg font-medium transition-all touch-feedback ${
          language === 'el' 
            ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
      >
        🇬🇷 ΕΛ
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg font-medium transition-all touch-feedback ${
          language === 'en' 
            ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};