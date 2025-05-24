'use client';

import React, { useState, useEffect } from 'react';
import { CustomUser } from '@/lib/firestoreAuth';
import { formatDate } from '@/lib/utils';
import { EventCard, EventFilters, NotificationsPanel, MyEventsPanel } from '.';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase-config';

// Örnek etkinlikler
const mockEvents = [
  {
    id: '1',
    title: 'Huawei Cloud Eğitim Günleri',
    description: 'Huawei Cloud teknolojilerini uygulamalı olarak öğreneceğiniz, uzman eğitmenler eşliğinde gerçekleşecek workshop etkinliği.',
    date: new Date(2023, 5, 15, 14, 0),
    location: 'Online',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400',
    category: 'Eğitim',
    isRegistered: false,
    capacity: 50,
    registeredCount: 32
  },
  {
    id: '2',
    title: 'HMS Workshop: App Gallery Entegrasyonu',
    description: 'Uygulamanızı Huawei AppGallery\'ye nasıl entegre edeceğinizi öğrenin ve global kullanıcılara ulaşın.',
    date: new Date(2023, 5, 20, 10, 0),
    location: 'Ankara, ODTÜ Teknokent',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&h=400',
    category: 'Workshop',
    isRegistered: true,
    capacity: 30,
    registeredCount: 28
  },
  {
    id: '3',
    title: 'HarmonyOS Geliştirici Konferansı',
    description: 'HarmonyOS\'un sunduğu fırsatları keşfedin ve geleceğin işletim sistemini yakından tanıyın.',
    date: new Date(2023, 6, 5, 9, 0),
    location: 'İstanbul, Teknopark',
    imageUrl: 'https://www.log.com.tr/wp-content/uploads/2024/10/3huawei-harmonyos-next-macerasi-resmi-olarak-basladi342.jpg',
    category: 'Konferans',
    isRegistered: false,
    capacity: 100,
    registeredCount: 65
  },
  {
    id: '4',
    title: 'AI ve Yapay Zeka ile Uygulama Geliştirme',
    description: 'Huawei HMS Core ML Kit ile mobil uygulamalarınıza yapay zeka özellikleri nasıl ekleyeceğinizi öğrenin.',
    date: new Date(2023, 6, 18, 13, 0),
    location: 'Online',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&h=400',
    category: 'Workshop',
    isRegistered: false,
    capacity: 70,
    registeredCount: 45
  },
  {
    id: '5',
    title: 'Kariyer Günleri: Huawei İş Fırsatları',
    description: 'Huawei\'de kariyer fırsatlarını keşfedin ve insan kaynakları uzmanlarımızla tanışın.',
    date: new Date(2023, 7, 2, 11, 0),
    location: 'İzmir, Dokuz Eylül Üniversitesi',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&h=400',
    category: 'Kariyer',
    isRegistered: false,
    capacity: 120,
    registeredCount: 78
  }
];

// Örnek bildirimler
const mockNotifications = [
  {
    id: '1',
    title: 'Etkinlik hatırlatması',
    message: 'HMS Workshop etkinliği yarın başlayacak. Hazır mısın?',
    date: new Date(2023, 5, 19, 10, 0),
    read: false
  },
  {
    id: '2',
    title: 'Yeni etkinlik',
    message: 'Yeni bir etkinlik eklendi: HarmonyOS Geliştirici Konferansı',
    date: new Date(2023, 5, 1, 9, 30),
    read: true
  },
  {
    id: '3',
    title: 'Etkinlik iptali',
    message: '10 Haziran tarihindeki IoT Workshop etkinliği iptal edildi.',
    date: new Date(2023, 4, 28, 15, 45),
    read: true
  }
];

interface UserDashboardProps {
  user: CustomUser | null;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [events, setEvents] = useState(mockEvents);
  const [myEvents, setMyEvents] = useState<typeof mockEvents>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Kullanıcının kayıtlı olduğu etkinlikleri Firebase'den çek
  useEffect(() => {
    const fetchUserRegistrations = async () => {
      if (!user || !user.uid) return;
      
      try {
        setLoading(true);
        
        // Kullanıcının etkinlik kayıtlarını al
        const registrationsQuery = query(
          collection(db, 'eventRegistrations'),
          where('userId', '==', user.uid)
        );
        
        const registrationsSnapshot = await getDocs(registrationsQuery);
        const registrationsData = registrationsSnapshot.docs.map(doc => ({
          id: doc.id,
          eventId: doc.data().eventId,
          ...doc.data()
        }));
        
        setMyRegistrations(registrationsData);
        
        // Kayıtlı etkinlikleri işaretle
        const updatedEvents = events.map(event => {
          const isRegistered = registrationsData.some(reg => reg.eventId === event.id);
          return {
            ...event,
            isRegistered
          };
        });
        
        setEvents(updatedEvents);
        
        // Kayıtlı etkinlikleri filtrele
        const registeredEvents = updatedEvents.filter(event => 
          registrationsData.some(reg => reg.eventId === event.id)
        );
        
        setMyEvents(registeredEvents);
      } catch (error) {
        console.error('Etkinlik kayıtları alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRegistrations();
  }, [user]);

  // Etkinliğe kayıt olma
  const handleRegisterEvent = (eventId: string) => {
    // Not: Kayıt işlemi artık EventCard içinde yapılıyor
    
    // UI'ı güncelle
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, isRegistered: true, registeredCount: event.registeredCount + 1 } 
          : event
      )
    );
    
    // Yeni bildirim ekle
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newNotification = {
        id: Date.now().toString(),
        title: 'Etkinlik kaydı',
        message: `"${event.title}" etkinliğine başarıyla kaydoldunuz.`,
        date: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };
  
  // Etkinlik kaydını iptal etme
  const handleUnregisterEvent = async (eventId: string) => {
    if (!user || !user.uid) return;
    
    try {
      // Firebase'den kaydı bul
      const registrationQuery = query(
        collection(db, 'eventRegistrations'),
        where('eventId', '==', eventId),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(registrationQuery);
      
      if (!querySnapshot.empty) {
        // Kaydı sil
        const registrationDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'eventRegistrations', registrationDoc.id));
        
        // UI'ı güncelle
        setEvents(prev => 
          prev.map(event => 
            event.id === eventId 
              ? { ...event, isRegistered: false, registeredCount: event.registeredCount - 1 } 
              : event
          )
        );
        
        // Kayıtlı etkinlikleri güncelle
        setMyEvents(prev => prev.filter(event => event.id !== eventId));
        
        // Kayıt listesini güncelle
        setMyRegistrations(prev => prev.filter(reg => reg.eventId !== eventId));
        
        // Yeni bildirim ekle
        const event = events.find(e => e.id === eventId);
        if (event) {
          const newNotification = {
            id: Date.now().toString(),
            title: 'Etkinlik iptali',
            message: `"${event.title}" etkinliği için kaydınızı iptal ettiniz.`,
            date: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
        }
      }
    } catch (error) {
      console.error('Etkinlik kaydı iptal edilirken hata oluştu:', error);
    }
  };
  
  // Bildirimi okundu olarak işaretle
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Tüm bildirimleri okundu olarak işaretle
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Filtreleri uygula
  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="mt-6 space-y-8">
      {/* Etkinlik banner */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-400/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1624377632657-3902bfd35249?auto=format&fit=crop&w=1400&h=400" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Merhaba, {user?.displayName || 'Kullanıcı'}</h2>
          <p className="text-white/90 max-w-lg">
            Huawei Student Developers etkinliklerini keşfedin, kayıt olun ve teknolojiyle dolu bir dünyaya adım atın.
          </p>
        </div>
      </div>
      
      {/* Ana içerik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol kolon - Etkinlikler */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Gelecek Etkinlikler</h2>
            
            {/* Filtreler */}
            <EventFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            
            {/* Etkinlik listesi */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <EventCard 
                  key={event.id}
                  event={event}
                  onRegister={() => handleRegisterEvent(event.id)}
                  onUnregister={() => handleUnregisterEvent(event.id)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Sağ kolon - Bildirimler ve kayıtlı etkinlikler */}
        <div className="space-y-6">
          {/* Bildirimler paneli */}
          <NotificationsPanel 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          
          {/* Kayıtlı etkinlikler paneli */}
          <MyEventsPanel 
            events={myEvents}
            onUnregister={handleUnregisterEvent}
          />
        </div>
      </div>
    </div>
  );
} 