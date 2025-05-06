'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EventForm from './EventForm';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Yazılım Geliştirme Workshop',
    description: 'Web geliştirme temellerini öğrenme workshop\'u.',
    date: '2025-05-15',
    time: '14:00',
    location: 'Yazılım Kulübü Laboratuvarı',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Yapay Zeka Konferansı',
    description: 'Güncel yapay zeka gelişmeleri ve uygulamaları.',
    date: '2025-05-20',
    time: '10:00',
    location: 'Konferans Salonu A',
    status: 'active',
  },
  {
    id: '3',
    title: 'Blockchain Teknolojileri Sunumu',
    description: 'Blockchain temelleri ve kullanım alanları.',
    date: '2025-05-10',
    time: '16:30',
    location: 'B Blok Amfi',
    status: 'completed',
  },
];

export default function EventList() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: uuidv4(),
      ...eventData,
    };

    setEvents([...events, newEvent]);
    setIsFormOpen(false);
  };

  const handleEditEvent = (eventData: Omit<Event, 'id'>) => {
    if (!editingEvent) return;

    setEvents(
      events.map((event) =>
        event.id === editingEvent.id
          ? { ...event, ...eventData }
          : event
      )
    );

    setEditingEvent(undefined);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const cancelEdit = () => {
    setEditingEvent(undefined);
    setIsFormOpen(false);
  };

  const getStatusBadgeClass = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Yaklaşan';
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <div>
      {(isFormOpen || editingEvent) && (
        <div className="mb-8">
          <EventForm
            event={editingEvent}
            onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
            onCancel={cancelEdit}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Etkinlikler ({events.length})
        </h3>
        
        {!isFormOpen && !editingEvent && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Etkinlik
          </button>
        )}
      </div>

      <div className="shadow overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Etkinlik
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tarih / Saat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Konum
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Durum
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Henüz etkinlik bulunmuyor.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {event.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(event.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      onClick={() => startEdit(event)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(event.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 