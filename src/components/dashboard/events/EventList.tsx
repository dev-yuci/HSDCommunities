'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EventForm from './EventForm';
import { 
  getAllEvents, 
  addEvent, 
  updateEvent, 
  deleteEvent, 
  Event as FirebaseEvent 
} from '@/lib/firestore-service';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  imageUrl: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export default function EventList() {
  const [events, setEvents] = useState<FirebaseEvent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Firebase'den etkinlikleri getir
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getAllEvents();
        console.log('Etkinlikler başarıyla getirildi:', fetchedEvents.length);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Etkinlikler getirilirken hata oluştu:', error);
        toast.error('Etkinlikler yüklenirken bir hata oluştu!');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Firebase'e yeni etkinlik ekle
  const handleAddEvent = async (eventData: EventFormData) => {
    try {
      setLoading(true);
      
      // Tarih ve saat birleştir
      const eventDate = new Date(`${eventData.date}T${eventData.time}`);
      
      // Firebase'e gönderilecek veriyi hazırla
      const newEventData = {
        title: eventData.title,
        description: eventData.description,
        date: eventDate,
        location: eventData.location,
        category: eventData.category,
        capacity: eventData.capacity,
        imageUrl: eventData.imageUrl || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400',
        registeredCount: 0,
        status: eventData.status
      };
      
      // Firebase'e kaydet
      const newEventId = await addEvent(newEventData);
      
      if (newEventId) {
        toast.success('Etkinlik başarıyla oluşturuldu!');
        
        // Yeni etkinliği state'e ekle
        const newEvent: FirebaseEvent = {
          id: newEventId,
          ...newEventData,
        };
        
        setEvents(prevEvents => [...prevEvents, newEvent]);
      } else {
        toast.error('Etkinlik oluşturulurken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Etkinlik eklenirken hata oluştu:', error);
      toast.error('Etkinlik eklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
      setIsFormOpen(false);
    }
  };

  // Firebase'deki etkinliği güncelle
  const handleEditEvent = async (eventData: EventFormData) => {
    if (!editingEvent?.id) return;
    
    try {
      setLoading(true);
      
      // Tarih ve saat birleştir
      const eventDate = new Date(`${eventData.date}T${eventData.time}`);
      
      // Firebase'e gönderilecek veriyi hazırla
      const updatedEventData = {
        title: eventData.title,
        description: eventData.description,
        date: eventDate,
        location: eventData.location,
        category: eventData.category,
        capacity: eventData.capacity,
        imageUrl: eventData.imageUrl || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400',
        status: eventData.status
      };
      
      // Firebase'de güncelle
      const success = await updateEvent(editingEvent.id, updatedEventData);
      
      if (success) {
        toast.success('Etkinlik başarıyla güncellendi!');
        
        // UI'da güncelle
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === editingEvent.id
              ? { ...event, ...updatedEventData }
              : event
          )
        );
      } else {
        toast.error('Etkinlik güncellenirken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Etkinlik güncellenirken hata oluştu:', error);
      toast.error('Etkinlik güncellenirken bir hata oluştu!');
    } finally {
      setLoading(false);
      setEditingEvent(undefined);
    }
  };

  // Firebase'den etkinliği sil
  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Firebase'den sil
      const success = await deleteEvent(id);
      
      if (success) {
        toast.success('Etkinlik başarıyla silindi!');
        
        // UI'dan kaldır
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      } else {
        toast.error('Etkinlik silinirken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Etkinlik silinirken hata oluştu:', error);
      toast.error('Etkinlik silinirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Etkinliği düzenleme moduna geçir
  const startEdit = (event: FirebaseEvent) => {
    // Tarih ve saat alanlarını ayır
    const date = event.date instanceof Date 
      ? event.date.toISOString().split('T')[0]
      : event.date instanceof Timestamp
        ? event.date.toDate().toISOString().split('T')[0]
        : '';
    
    const time = event.date instanceof Date
      ? event.date.toTimeString().substring(0, 5)
      : event.date instanceof Timestamp
        ? event.date.toDate().toTimeString().substring(0, 5)
        : '';
    
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date,
      time,
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      imageUrl: event.imageUrl,
      status: event.status || 'upcoming' as 'upcoming',
    });
  };

  const cancelEdit = () => {
    setEditingEvent(undefined);
    setIsFormOpen(false);
  };

  const getStatusBadgeClass = (status?: string) => {
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

  const getStatusText = (status?: string) => {
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
        return 'Yaklaşan';
    }
  };

  // Tarih formatlama fonksiyonu
  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Saat formatlama fonksiyonu
  const formatTime = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Etkinlik
              </>
            )}
          </button>
        )}
      </div>

      {/* Yükleme Durumu */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" 
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz etkinlik bulunmuyor</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Yeni bir etkinlik eklemek için düğmeye tıklayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={() => startEdit(event)} 
              onDelete={() => handleDelete(event.id)}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// EventCard bileşeni
interface EventCardProps {
  event: FirebaseEvent;
  onEdit: () => void;
  onDelete: () => void;
  loading: boolean;
}

function EventCard({ event, onEdit, onDelete, loading }: EventCardProps) {
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [fetchingRegistrations, setFetchingRegistrations] = useState(false);

  // Kayıt olan kullanıcıları getir
  const fetchRegistrations = async () => {
    if (fetchingRegistrations) return;
    
    try {
      setFetchingRegistrations(true);
      
      // Etkinliğe kayıt olan kullanıcıları Firestore'dan getir
      const response = await fetch(`/api/events/registrations?eventId=${event.id}`);
      
      if (!response.ok) {
        throw new Error('Kayıtlar alınırken bir hata oluştu');
      }
      
      const data = await response.json();
      setRegistrations(data.registrations || []);
      setShowRegistrations(true);
    } catch (error) {
      console.error('Kayıtlar alınırken hata oluştu:', error);
      toast.error('Kayıtlar yüklenirken bir hata oluştu!');
    } finally {
      setFetchingRegistrations(false);
    }
  };

  // Tarih formatlama
  const formatEventDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Kontenjan doluluk yüzdesi
  const capacityPercentage = Math.min(
    Math.round((event.registeredCount / event.capacity) * 100),
    100
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg flex flex-col">
      {/* Etkinlik görseli */}
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400';
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {event.category}
        </div>
      </div>
      
      {/* Etkinlik bilgileri */}
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{event.title}</h3>
        
        <div className="mb-3 text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatEventDate(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
        
        {/* Kontenjan durum çubuğu */}
        <div className="mt-3 mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Kontenjan
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {event.registeredCount}/{event.capacity}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                capacityPercentage < 50 ? 'bg-green-500' : 
                capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{event.description}</p>
      </div>
      
      {/* Kayıt detayları */}
      {showRegistrations && (
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Kayıt Olan Kullanıcılar</h4>
          
          {registrations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Henüz kayıt yapan kullanıcı yok.</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {registrations.map((registration, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-medium mr-2">
                      {registration.displayName?.charAt(0)?.toUpperCase() || registration.email?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span>{registration.displayName || registration.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            onClick={() => setShowRegistrations(false)}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Gizle
          </button>
        </div>
      )}
      
      {/* Butonlar */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={fetchRegistrations}
          disabled={fetchingRegistrations || loading || showRegistrations}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
        >
          {fetchingRegistrations ? (
            <span className="flex items-center">
              <svg className="animate-spin mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yükleniyor...
            </span>
          ) : showRegistrations ? "" : "Kayıtları Göster"}
        </button>
        
        <div>
          <button
            onClick={onEdit}
            disabled={loading}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3 disabled:opacity-50"
          >
            Düzenle
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
} 