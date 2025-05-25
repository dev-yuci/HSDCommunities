import React from 'react';
import { formatDate, formatShortDate } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { Event } from './EventCard';

interface MyEventsPanelProps {
  events: Event[];
  onUnregister: (eventId: string) => void;
}

export default function MyEventsPanel({ events, onUnregister }: MyEventsPanelProps) {
  // Timestamp veya Date nesnesini formatlamak için yardımcı fonksiyon
  const getFormattedDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return formatShortDate(date.toDate());
    }
    return formatShortDate(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kayıtlı Etkinliklerim</h2>
      
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex flex-col sm:flex-row border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              {/* Mobil görünüm için sol taraf (resim) */}
              <div className="sm:hidden w-full h-24 bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.freepik.com/free-vector/flat-design-abstract-background_23-2149120347.jpg';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white">
                    {event.category}
                  </span>
                </div>
              </div>
              
              {/* Desktop görünüm */}
              <div className="hidden sm:block w-24 h-24 bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.freepik.com/free-vector/flat-design-abstract-background_23-2149120347.jpg';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-blue-500 text-white">
                    {event.category}
                  </span>
                </div>
              </div>
              
              {/* Etkinlik detayları */}
              <div className="flex-grow p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getFormattedDate(event.date)} • {event.location}</p>
                  </div>
                  <button
                    onClick={() => onUnregister(event.id)}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg 
            className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" 
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Henüz kayıtlı etkinliğiniz bulunmuyor</p>
        </div>
      )}
    </div>
  );
} 