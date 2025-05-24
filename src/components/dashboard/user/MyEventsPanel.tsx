import React from 'react';
import { formatDate, formatShortDate } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  category: string;
  isRegistered: boolean;
  capacity: number;
  registeredCount: number;
};

interface MyEventsPanelProps {
  events: Event[];
  onUnregister: (id: string) => void;
}

export default function MyEventsPanel({ events, onUnregister }: MyEventsPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      {/* Panel başlığı */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kayıtlı Etkinliklerim</h3>
        {events.length > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {events.length} etkinlik
          </span>
        )}
      </div>
      
      {/* Etkinlik listesi */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Henüz etkinlik kaydınız yok</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors group">
              {/* Etkinlik tarihi */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase">
                    {new Date(event.date).toLocaleString('tr-TR', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
              </div>
              
              {/* Etkinlik bilgileri */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="flex-shrink-0 h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="flex-shrink-0 h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
              
              {/* İptal butonu */}
              <div className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onUnregister(event.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Kaydı iptal et"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 