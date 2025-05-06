'use client';

import React, { useState } from 'react';
import { Event } from "@/data/eventsData";
import EventCard from '@/components/events/EventCard';
import Button from '../ui/Button';
import Link from 'next/link';
import EventModal from '@/components/events/EventModal';

// Mock veri - gerçek uygulamada API'dan gelecektir
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "HMS Core Workshop",
    description: "Huawei Mobile Services Core API'leri hakkında kapsamlı bir workshop. Uygulama geliştirmeyi ve HMS entegrasyonlarını öğrenin.",
    date: "2025-04-15",
    location: "İstanbul Teknik Üniversitesi",
    category: "Workshop",
    organizer: "HSD İTÜ"
  },
  {
    id: 2,
    title: "AppGallery Uygulama Geliştirme",
    description: "AppGallery'de uygulama yayınlama ve optimizasyon stratejileri hakkında detaylı bilgiler edinebileceğiniz seminer.",
    date: "2025-04-22",
    location: "ODTÜ",
    category: "Seminer",
    organizer: "HSD ODTÜ"
  },
  {
    id: 3,
    title: "HarmonyOS Uygulama Bootcamp",
    description: "HarmonyOS için uygulama geliştirmeyi öğrenin. Bu yoğun bootcamp ile HarmonyOS'un temellerini kavrayabilirsiniz.",
    date: "2025-05-07",
    location: "Ege Üniversitesi",
    category: "Bootcamp",
    organizer: "HSD Ege"
  },
  {
    id: 4,
    title: "Huawei Cloud Workshop",
    description: "Huawei Cloud hizmetlerini ve çözümlerini öğrenin. Bu workshop, bulut bilişim alanındaki son gelişmeleri içerir.",
    date: "2025-05-12",
    location: "Online",
    category: "Workshop",
    organizer: "HSD Türkiye"
  },
  {
    id: 5,
    title: "Petal Search API Webinar",
    description: "Petal Search API'leri ile arama deneyiminizi geliştirebilirsiniz. Bu webinar, API entegrasyonlarını gösterir.",
    date: "2025-05-20",
    location: "Online",
    category: "Webinar",
    organizer: "HSD Bilkent"
  },
  {
    id: 6,
    title: "Huawei Mobile Services Hackatonu",
    description: "48 saatlik uygulama geliştirme yarışması. Yazılım geliştiriciler, tasarımcılar ve ürün yöneticilerinden oluşan takımlar yenilikçi uygulamalar geliştirecek.",
    date: "2025-05-25",
    location: "Boğaziçi Üniversitesi",
    category: "Hackathon",
    organizer: "HSD Boğaziçi"
  },
  {
    id: 7,
    title: "Yapay Zeka Konferansı",
    description: "Huawei'nin yapay zeka teknolojilerine ve uygulamalarına derinlemesine bir bakış. Sektörün önde gelen uzmanları konuşmacı olarak katılacak.",
    date: "2025-06-03",
    location: "Ankara Üniversitesi",
    category: "Konferans",
    organizer: "HSD Ankara"
  },
  {
    id: 8,
    title: "Huawei Mobile Services Eğitimi",
    description: "Huawei Mobile Services ekosistemi hakkında detaylı bir eğitim. HMS Core, AppGallery ve diğer Huawei servisleri hakkında bilgi edineceksiniz.",
    date: "2025-06-10",
    location: "Yıldız Teknik Üniversitesi",
    category: "Eğitim",
    organizer: "HSD YTÜ"
  }
];

// Kategori renkleri
const categoryColors: Record<string, string> = {
  "Workshop": "bg-blue-100 text-blue-700",
  "Seminer": "bg-green-100 text-green-700",
  "Hackathon": "bg-purple-100 text-purple-700",
  "Panel": "bg-amber-100 text-amber-700", 
  "Konferans": "bg-red-100 text-red-700",
  "Meetup": "bg-teal-100 text-teal-700",
  "Bootcamp": "bg-indigo-100 text-indigo-700",
  "Webinar": "bg-pink-100 text-pink-700",
  "Eğitim": "bg-cyan-100 text-cyan-700"
};

export default function EventsSection() {
  // Seçilen etkinlik için state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 text-sm font-semibold tracking-wider uppercase">Takvim</span>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Yaklaşan Etkinlikler
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            HSD gruplarının düzenlediği Huawei teknolojileri etkinliklerini kaçırmayın
          </p>
        </div>
        
        <div className="relative">
          {/* Kaydırma konteynerı */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {/* Kart konteynerı */}
            <div className="flex space-x-6 w-max">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="w-80 flex-shrink-0">
                  <EventCard 
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                    categoryColor={categoryColors[event.category || "Workshop"] || "bg-gray-100 text-gray-700"}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll indikatörü */}
          <div className="mt-6 hidden sm:flex justify-center space-x-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/events">
            <Button 
              variant="secondary"
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/20"
            >
              <span className="relative z-10 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 font-semibold hover:from-blue-500 hover:to-indigo-600 dark:from-blue-500 dark:to-indigo-400 dark:hover:from-blue-400 dark:hover:to-indigo-300 transition-all duration-300">
                Tüm Etkinlikleri Gör
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 fill-transparent stroke-current text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-0 group-hover:w-full transition-all duration-500"></span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          categoryColor={categoryColors[selectedEvent.category || "Workshop"] || "bg-gray-100 text-gray-700"}
        />
      )}
    </section>
  );
} 