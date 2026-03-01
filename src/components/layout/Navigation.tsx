import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../store/languageStore';
import { useTheme } from '../../store/themeStore';
import { NotificationBell } from '../notifications/NotificationBell';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const navItems = [
    { path: '/', icon: '🏠', label: t('home'), activeIcon: '🏠' },
    { path: '/track', icon: '🏃', label: t('track'), activeIcon: '🏃' },
    { path: '/history', icon: '📅', label: t('history'), activeIcon: '📅' },
    { path: '/statistics', icon: '📊', label: t('statistics'), activeIcon: '📊' },
    { path: '/profile', icon: '👤', label: t('profile'), activeIcon: '👤' },
  ];

  if (location.pathname === '/login') return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md z-[100] glass rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/40 animate-slide-up">
      <div className="px-4 py-3">
        <div className="flex justify-around items-center h-20 md:h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              className="relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 group flex-1"
            >
              {/* Active/Background indicator */}
              {isActive(item.path) && (
                <span className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl animate-fade-in" />
              )}
              
              {/* Icon with animation */}
              <span 
                className={`text-2xl md:text-3xl transform transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'text-blue-600 dark:text-blue-400 scale-125' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 group-hover:scale-115'
                }`}
              >
                {item.icon}
              </span>
              
              {/* Label with animation */}
              <span 
                className={`text-xs md:text-sm font-medium mt-1 transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-blue-600 dark:text-blue-400 opacity-100'
                    : 'text-gray-600 dark:text-gray-400 opacity-80 group-hover:opacity-100'
                }`}
              >
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive(item.path) && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
              )}
              
              {/* Hover tooltip για desktop */}
              {hoveredPath === item.path && !isActive(item.path) && (
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800 text-xs py-2 px-3 rounded-xl whitespace-nowrap animate-fade-in shadow-lg z-[101]">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};