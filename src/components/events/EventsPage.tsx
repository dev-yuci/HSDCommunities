'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventList from "@/components/events/EventList";
import { CalendarCheck, Users, MapPin, ArrowRight } from 'lucide-react';
import { eventsData } from '@/data/eventsData';

export default function EventsPage() {
  // Yaklaşan etkinlikleri hesapla
  const now = new Date();
  const upcomingEvents = eventsData.filter(event => new Date(event.date) >= now);
  const nextEvent = [...upcomingEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 rounded-l-full transform translate-x-1/3"></div>
          <div className="absolute left-0 bottom-0 h-64 w-64 bg-blue-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                HSD Etkinlikleri
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Teknoloji dünyasının nabzını tutan, bilgi ve deneyim paylaşımına olanak sağlayan etkinliklerimizle yeni teknolojileri keşfedin ve ağınızı genişletin.
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">{upcomingEvents.length}</div>
                  <div className="text-xs text-blue-200">Yaklaşan Etkinlik</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">{eventsData.length}</div>
                  <div className="text-xs text-blue-200">Toplam Etkinlik</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">15+</div>
                  <div className="text-xs text-blue-200">Konum</div>
                </div>
              </div>
            </div>
            
            {nextEvent && (
              <div className="md:w-5/12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-blue-200 uppercase tracking-wider">Yaklaşan Etkinlik</div>
                  <span className="bg-green-500/20 text-green-300 text-xs py-1 px-3 rounded-full">
                    Yeni
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{nextEvent.title}</h2>
                
                <div className="flex items-center gap-2 text-blue-100 mb-2 text-sm">
                  <CalendarCheck className="w-4 h-4" />
                  <span>
                    {new Date(nextEvent.date).toLocaleDateString("tr-TR", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-blue-100 mb-4 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{nextEvent.location}</span>
                </div>
                
                <p className="text-blue-50 mb-6 line-clamp-2">{nextEvent.description}</p>
                
                <div className="flex justify-between items-center">
                  <button className="bg-white text-indigo-700 hover:bg-blue-50 px-6 py-2 rounded-full font-medium transition flex items-center gap-2">
                    <span>Detayları Gör</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-2 text-blue-200">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">120+ katılımcı</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Tüm Etkinliklerimiz</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Öğrenmek, keşfetmek ve bağlantı kurmak için düzenlediğimiz etkinliklerimize katılın. Zamanınızı ve yerinizi ayırmayı unutmayın!</p>
        </div>
        <EventList />
      </main>
      
      <Footer />
    </div>
  );
} 