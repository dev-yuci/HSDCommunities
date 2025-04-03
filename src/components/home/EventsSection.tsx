import React from 'react';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

// Mock veri - gerçek uygulamada API'dan gelecektir
const upcomingEvents = [
  {
    id: 1,
    title: "HMS Core Workshop",
    date: "15 Nisan 2025",
    time: "19:00",
    location: "İstanbul Teknik Üniversitesi",
    organizer: "HSD İTÜ",
    image: "/placeholder.png",
    category: "Workshop",
    color: "from-red-500 to-red-700"
  },
  {
    id: 2,
    title: "AppGallery Uygulama Geliştirme",
    date: "22 Nisan 2025",
    time: "10:00",
    location: "ODTÜ",
    organizer: "HSD ODTÜ",
    image: "/placeholder.png",
    category: "Geliştirme",
    color: "from-red-600 to-red-800"
  },
  {
    id: 3,
    title: "HarmonyOS Uygulama Bootcamp",
    date: "7 Mayıs 2025",
    time: "13:00",
    location: "Ege Üniversitesi",
    organizer: "HSD Ege",
    image: "/placeholder.png",
    category: "Bootcamp",
    color: "from-red-500 to-red-900"
  },
  {
    id: 4,
    title: "Huawei Cloud Workshop",
    date: "12 Mayıs 2025",
    time: "15:30",
    location: "Online",
    organizer: "HSD Türkiye",
    image: "/placeholder.png",
    category: "Workshop",
    color: "from-rose-500 to-red-700"
  },
  {
    id: 5,
    title: "Petal Search API Webinar",
    date: "20 Mayıs 2025",
    time: "14:00",
    location: "Online",
    organizer: "HSD Bilkent",
    image: "/placeholder.png",
    category: "Webinar",
    color: "from-red-400 to-red-600"
  },
  {
    id: 6,
    title: "Huawei Mobile Services Hackatonu",
    date: "25 Mayıs 2025",
    time: "09:00",
    location: "Boğaziçi Üniversitesi",
    organizer: "HSD Boğaziçi",
    image: "/placeholder.png",
    category: "Hackathon",
    color: "from-red-500 to-red-800"
  },
  {
    id: 7,
    title: "Yapay Zeka Konferansı",
    date: "3 Haziran 2025",
    time: "11:00",
    location: "Ankara Üniversitesi",
    organizer: "HSD Ankara",
    image: "/placeholder.png",
    category: "Konferans",
    color: "from-rose-600 to-red-700"
  },
  {
    id: 8,
    title: "Huawei Mobile Services Eğitimi",
    date: "10 Haziran 2025",
    time: "16:00",
    location: "Yıldız Teknik Üniversitesi",
    organizer: "HSD YTÜ",
    image: "/placeholder.png",
    category: "Eğitim",
    color: "from-red-500 to-red-600"
  }
];

export default function EventsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 text-sm font-semibold tracking-wider uppercase">Takvim</span>
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
                <div key={event.id} className="w-72 flex-shrink-0">
                  <Card 
                    hover 
                    className="h-full flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className={`h-48 bg-gradient-to-br ${event.color} relative overflow-hidden`}>
                      {/* Etkinlik görseli */}
                      <div className="absolute inset-0 flex items-center justify-center text-white opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      {/* Kategori etiketi */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-white">{event.category}</span>
                      </div>
                      
                      {/* Organizatör */}
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-white">
                            {event.organizer.substring(4, 6)}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-white drop-shadow-sm">{event.organizer}</span>
                      </div>
                    </div>
                    
                    <CardContent className="flex-grow px-6 py-5">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{event.title}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="font-medium block">{event.date}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">{event.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4">
                      <Button 
                        variant="outline" 
                        className="w-full group relative overflow-hidden transition-all duration-300 border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Katıl
                          <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll indikatörü */}
          <div className="mt-6 hidden sm:flex justify-center space-x-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            variant="secondary"
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/20"
          >
            <span className="relative z-10 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 font-semibold hover:from-red-500 hover:to-red-300 dark:from-red-500 dark:to-red-300 dark:hover:from-red-400 dark:hover:to-red-200 transition-all duration-300">
              Tüm Etkinlikleri Gör
              <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 fill-transparent stroke-current text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-0 group-hover:w-full transition-all duration-500"></span>
          </Button>
        </div>
      </div>
    </section>
  );
} 