// components/events/EventModal.tsx
import React, { useState } from "react";
import { Event } from "@/data/eventsData";
import { CalendarDays, MapPin, X, Clock, Users, Link2, Share2, ChevronDown, MessageCircle, Award, Check } from "lucide-react";

interface Props {
  event: Event;
  onClose: () => void;
  categoryColor?: string;
}

const EventModal = ({ event, onClose, categoryColor = "bg-blue-100 text-blue-700" }: Props) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const [activeTab, setActiveTab] = useState<'details' | 'sessions' | 'speakers'>('details');

  // Varsayılan konuşmacılar
  const speakers = [
    { 
      name: "Dr. Ahmet Yılmaz", 
      title: "Yapay Zeka Uzmanı",
      company: "XYZ Teknoloji",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Yapay zeka ve makine öğrenimi alanlarında 10+ yıl deneyime sahip uzman. Büyük veri analizi ve derin öğrenme konularında birçok projede görev almıştır.",
      email: "ahmet.yilmaz@xyztechnology.com",
      linkedin: "ahmetyilmaz",
      twitter: "@drahmetyilmaz",
      skills: ["Yapay Zeka", "Makine Öğrenimi", "Derin Öğrenme", "Veri Bilimi"]
    },
    { 
      name: "Zeynep Kaya", 
      title: "Baş Mühendis",
      company: "ABC Yazılım",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Fullstack geliştirme ve bulut mimarileri konusunda uzman. Açık kaynak projelere aktif katkı sağlıyor ve yazılım toplulukları organize ediyor.",
      email: "zeynep.kaya@abcyazilim.com",
      linkedin: "zeynepkaya",
      twitter: "@zeynepkaya",
      skills: ["Frontend", "Backend", "Bulut Mimarisi", "Açık Kaynak"]
    }
  ];

  // Oturum programı
  const sessions = [
    { time: "13:30 - 14:00", title: "Kayıt ve Karşılama", speaker: "" },
    { time: "14:00 - 14:30", title: "Açılış Konuşması", speaker: "Dr. Ahmet Yılmaz" },
    { time: "14:30 - 15:30", title: "Ana Oturum: Teknoloji Trendleri", speaker: "Zeynep Kaya" },
    { time: "15:30 - 16:00", title: "Kahve Molası", speaker: "" },
    { time: "16:00 - 17:00", title: "Uygulama Workshop'u", speaker: "Dr. Ahmet Yılmaz & Ekibi" },
    { time: "17:00 - 17:30", title: "Soru & Cevap", speaker: "Tüm Konuşmacılar" },
    { time: "17:30 - 18:00", title: "Kapanış ve Networking", speaker: "" }
  ];

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Kayıt işlemi burada yapılabilir
    // Uyarı yerine modern bir toast bildirim kullanabiliriz
    showToast('register');
  };

  const handleShare = (e: React.MouseEvent, platform: string) => {
    e.stopPropagation();
    // Paylaşım işlemi burada yapılabilir
    showToast('share', platform);
  };

  // Modern toast bildirim sistemi
  const showToast = (type: 'register' | 'share' | 'directions', platform?: string) => {
    // Toast oluştur
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-100 p-4 flex items-center z-[60] animate-fade-in-up max-w-md";
    
    // İçerik
    let content = '';
    if (type === 'register') {
      content = `
        <div class="bg-green-500 rounded-full p-2 text-white mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-800">Etkinliğe başarıyla kaydoldunuz!</p>
          <p class="text-sm text-gray-600">${event.title}</p>
        </div>
      `;
    } else if (type === 'share') {
      content = `
        <div class="bg-blue-500 rounded-full p-2 text-white mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-800">Etkinlik ${platform} üzerinde paylaşıldı</p>
          <p class="text-sm text-gray-600">${event.title}</p>
        </div>
      `;
    } else if (type === 'directions') {
      content = `
        <div class="bg-indigo-500 rounded-full p-2 text-white mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-800">Konum bilgileri açılıyor</p>
          <p class="text-sm text-gray-600">${event.location}</p>
        </div>
      `;
    }
    
    toast.innerHTML = content + `
      <button class="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
    
    // Kapatma butonunu etkinleştir
    toast.querySelector('button')?.addEventListener('click', () => {
      document.body.removeChild(toast);
    });
    
    // Ekle ve zamanlayıcı ayarla
    document.body.appendChild(toast);
    setTimeout(() => {
      // Çıkış animasyonu
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-xl animate-fade-in overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <div className={`${categoryColor.replace('bg-blue-100 text-blue-700', 'bg-white/20 text-white')} px-2.5 py-1 rounded text-xs font-medium`}>
              {event.category || "Workshop"}
            </div>
            {isUpcoming && (
              <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-100">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
                Yaklaşan
              </span>
            )}
            {event.organizer && (
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {event.organizer}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {event.title}
          </h2>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <CalendarDays className="w-4 h-4" />
              <span>
                {eventDate.toLocaleDateString("tr-TR", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Clock className="w-4 h-4" />
              <span>14:00 - 18:00</span>
            </div>

            <div className="flex items-center gap-2 text-white/90 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Etkinlik Detayları
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Program
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'speakers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Konuşmacılar
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'details' && (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {/* Etkinlik Açıklaması */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                      Etkinlik Açıklaması
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>

                  {/* Neler Öğreneceksiniz */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      Neler Öğreneceksiniz
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      {['Sektördeki en son teknoloji trendleri', 'Pratik uygulama teknikleri', 'Network geliştirme fırsatları', 'Problem çözme becerileri'].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  {/* Bilgi Kartı */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Hızlı Bilgiler</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm">
                        <span className="bg-blue-100 p-1.5 rounded text-blue-600 mr-2">
                          <Users className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-gray-500 block">Katılımcı Sayısı</span>
                          <span className="font-medium">120 kişi (40 kontenjan kaldı)</span>
                        </div>
                      </li>
                      {event.organizer && (
                        <li className="flex items-start text-sm">
                          <span className="bg-blue-100 p-1.5 rounded text-blue-600 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </span>
                          <div>
                            <span className="text-gray-500 block">Düzenleyen</span>
                            <span className="font-medium">{event.organizer}</span>
                          </div>
                        </li>
                      )}
                      <li className="flex items-start text-sm">
                        <span className="bg-blue-100 p-1.5 rounded text-blue-600 mr-2">
                          <Clock className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-gray-500 block">Etkinlik Süresi</span>
                          <span className="font-medium">4 saat</span>
                        </div>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="bg-blue-100 p-1.5 rounded text-blue-600 mr-2">
                          <MessageCircle className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-gray-500 block">Etkinlik Dili</span>
                          <span className="font-medium">Türkçe</span>
                        </div>
                      </li>
                    </ul>
                  </div>
              
                  {/* Konum */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 text-sm font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Etkinlik Konumu
                    </div>
                    <div className="h-64 bg-gray-200 relative group">
                      <iframe 
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDbhtvgUKOCctX5r9F3JnU_Wi2vMLKxpto&q=${encodeURIComponent(event.location)}&zoom=15&language=tr`}
                        className="w-full h-full border-0"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <span className="text-white text-sm font-medium shadow-sm">
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                        <span>{event.location}</span>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Detaylı ulaşım bilgileri katılımcılarla paylaşılacaktır.</p>
                      <div className="flex gap-2 mt-3">
                        <button 
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-blue-600 py-1.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('directions');
                            // Google Maps yönlendirmesini yeni pencerede aç
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`, '_blank');
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Yol Tarifi Al
                        </button>
                        <button 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Google Maps'te tam ekran görüntüleme
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank');
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Katılımcılar */}
              <div className="mb-6 mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Katılımcılar</h3>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium overflow-hidden">
                        <img 
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 20}.jpg`}
                          alt="Katılımcı"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    +114
                  </div>
                  <span className="ml-2 text-sm text-gray-500">120+ kişi katılıyor</span>
                </div>
              </div>
              
              {/* Paylaşım ve Kayıt */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleShare(e, 'Twitter')}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.045 10.045 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14-7.497 14-13.986 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, 'LinkedIn')}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleShare(e, 'Copy Link')}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                      <Link2 size={20} className="text-gray-700" />
                    </button>
                  </div>

                  {isUpcoming && (
                    <button
                      onClick={handleRegister}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Users size={18} />
                      <span>Katılımcı Olun</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Etkinlik Programı</h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-16 border-l-2 border-blue-100"></div>
                {sessions.map((session, index) => (
                  <div key={index} className="flex mb-6 relative">
                    <div className="w-16 text-right text-sm text-gray-500 font-medium pt-0.5 pr-4">
                      {session.time.split('-')[0]}
                    </div>
                    <div className="h-4 w-4 bg-blue-500 rounded-full absolute left-[62px] top-1.5 border-2 border-white"></div>
                    <div className="flex-1 pl-8">
                      <div className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <h4 className="font-medium">{session.title}</h4>
                        {session.speaker && (
                          <p className="text-sm text-gray-600 mt-1">
                            Konuşmacı: {session.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'speakers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Etkinlik Konuşmacıları
              </h3>
              <div className="space-y-6">
                {speakers.map((speaker, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-5">
                    <div className="flex items-start">
                      {/* Yuvarlak profil görseli */}
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                          <img 
                            src={speaker.image} 
                            alt={speaker.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Konuşmacı bilgileri */}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{speaker.name}</h4>
                        <div className="flex flex-wrap items-center mt-1 mb-2">
                          <span className="text-blue-600 font-medium text-sm">{speaker.title}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-gray-600 text-sm">{speaker.company}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">{speaker.bio}</p>
                        
                        {/* Uzmanlık alanları */}
                        <div className="mt-3">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Alanları</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {speaker.skills.map((skill, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* İletişim bilgileri - alt kısım */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                      <a href={`mailto:${speaker.email}`} className="flex items-center text-gray-500 hover:text-blue-600 text-xs transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {speaker.email}
                      </a>
                      <a href={`https://linkedin.com/in/${speaker.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 text-xs transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
                        <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                      <a href={`https://twitter.com/${speaker.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 text-xs transition-colors bg-gray-50 px-3 py-1.5 rounded-full">
                        <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.045 10.045 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14-7.497 14-13.986 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </a>
                      <button className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                        <span>Oturumlar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
