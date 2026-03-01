import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { useTranslation } from '../../store/languageStore';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const locale = language === 'el' ? el : enUS;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors touch-feedback"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse min-w-[20px] h-5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-80 md:w-96 glass rounded-2xl shadow-2xl z-[200] border border-white/30 dark:border-gray-700/40 animate-scale-in">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                {t('notifications')}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors touch-feedback bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
                >
                  {t('markAllRead')}
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto smooth-scroll no-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <span className="text-4xl block mb-3">🔔</span>
                  <p>{t('noNotifications')}</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {notification.type === 'follow' && '👤'}
                        {notification.type === 'like' && '❤️'}
                        {notification.type === 'comment' && '💬'}
                        {notification.type === 'achievement' && '🏆'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale })}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-2"></span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};