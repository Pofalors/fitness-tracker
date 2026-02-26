import React from 'react';
import { useLanguageStore } from '../../store/languageStore';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100  rounded-xl">
      <button
        onClick={() => setLanguage('el')}
        className={`px-3 py-1 rounded-lg font-medium transition-all ${
          language === 'el' 
            ? 'bg-white  shadow-md text-blue-600' 
            : 'hover:bg-gray-200 '
        }`}
      >
        🇬🇷 ΕΛ
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg font-medium transition-all ${
          language === 'en' 
            ? 'bg-white  shadow-md text-blue-600' 
            : 'hover:bg-gray-200 '
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};