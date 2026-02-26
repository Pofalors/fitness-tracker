import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../store/languageStore';
import { useTheme } from '../../store/themeStore';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/', icon: '🏠', label: t('home') },
    { path: '/track', icon: '🏃', label: t('track') },
    { path: '/history', icon: '📅', label: t('history') },
    { path: '/statistics', icon: '📊', label: t('statistics') },
    { path: '/profile', icon: '👤', label: t('profile') },
  ];

  if (location.pathname === '/login') return null;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 md:top-0 md:bottom-auto md:border-t-0 md:border-b ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 md:h-20">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'text-blue-600 dark:text-blue-400 scale-110'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:scale-105'
              }`}
            >
              <span className="text-xl md:text-2xl">{item.icon}</span>
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <div className="absolute bottom-0 md:bottom-auto md:top-0 w-12 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};