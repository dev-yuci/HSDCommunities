'use client';

import React, { useState } from 'react';
import { EventFormData } from './EventList';

interface EventFormProps {
  event?: EventFormData;
  onSubmit: (event: EventFormData) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || '');
  const [time, setTime] = useState(event?.time || '');
  const [location, setLocation] = useState(event?.location || '');
  const [category, setCategory] = useState(event?.category || 'Workshop');
  const [capacity, setCapacity] = useState(event?.capacity || 30);
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400');
  const [status, setStatus] = useState<'upcoming' | 'active' | 'completed' | 'cancelled'>(event?.status || 'upcoming');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      id: event?.id,
      title,
      description,
      date,
      time,
      location,
      category,
      capacity,
      imageUrl,
      status,
    });
  };

  // Kategori seçenekleri
  const categoryOptions = [
    'Workshop',
    'Eğitim',
    'Konferans',
    'Webinar',
    'Hackathon',
    'Kariyer',
    'Networking'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          {event ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Etkinlik Adı
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tarih
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Saat
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Konum
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kategori
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                >
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kontenjan
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                  min={1}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Görsel URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Görsel URL boş bırakılırsa varsayılan görsel kullanılacaktır.
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Durum
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'upcoming' | 'active' | 'completed' | 'cancelled')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm"
              >
                <option value="upcoming">Yaklaşan</option>
                <option value="active">Aktif</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {event ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 