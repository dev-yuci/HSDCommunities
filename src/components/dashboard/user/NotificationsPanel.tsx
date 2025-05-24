import React from 'react';
import { formatDate } from '@/lib/utils';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
};

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationsPanel({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      {/* Panel başlığı */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {unreadCount} yeni
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Tümünü okundu işaretle
          </button>
        )}
      </div>
      
      {/* Bildirim listesi */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Henüz bildiriminiz yok</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`
                flex p-3 rounded-lg transition-colors cursor-pointer
                ${notification.read 
                  ? 'bg-white dark:bg-gray-800' 
                  : 'bg-blue-50 dark:bg-blue-900/10'
                }
              `}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mr-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${notification.read 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }
                `}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className={`
                    text-sm font-medium truncate
                    ${notification.read 
                      ? 'text-gray-700 dark:text-gray-300' 
                      : 'text-gray-900 dark:text-white'
                    }
                  `}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(notification.date)}
                  </span>
                </div>
                <p className={`
                  text-sm mt-1
                  ${notification.read 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-gray-600 dark:text-gray-300'
                  }
                `}>
                  {notification.message}
                </p>
              </div>
              
              {!notification.read && (
                <div className="ml-2 flex-shrink-0">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 