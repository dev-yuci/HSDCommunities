// components/events/EventCard.tsx
import React from "react";
import { Event } from "@/data/eventsData";
import { CalendarDays, MapPin, Clock, Users, Star } from "lucide-react";

interface Props {
  event: Event;
  onClick: () => void;
  categoryColor?: string;
}

const EventCard = ({ event, onClick, categoryColor = "bg-blue-100 text-blue-700" }: Props) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  
  // Etkinlik kategorisine göre kapak resmi seç
  const getCoverImage = (category?: string) => {
    const images: Record<string, string> = {
      "Workshop": "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?w=500",
      "Seminer": "https://images.unsplash.com/photo-1558008258-d9f4aa2a7926?w=500",
      "Hackathon": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
      "Panel": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500",
      "Konferans": "https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=500",
      "Meetup": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500"
    };
    
    return images[category || "Workshop"] || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500";
  };

  // Etkinlik konumun kısa gösterimi
  const shortLocation = event.location.split(' ').slice(0, 2).join(' ');

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group flex flex-col h-full"
    >
      {/* Kapak Görseli */}
      <div className="relative h-40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-center bg-cover transform group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url('${getCoverImage(event.category)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        
        {/* Üst etiketler */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className={`${categoryColor} px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm`}>
            {event.category || "Workshop"}
          </div>
          {isUpcoming && (
            <span className="inline-flex items-center rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm animate-pulse">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-white"></span>
              Yaklaşan
            </span>
          )}
        </div>
        
        {/* Alt tarih kutusu */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-800 shadow-sm flex items-center">
          <CalendarDays className="w-3.5 h-3.5 text-blue-600 mr-1" />
          {eventDate.toLocaleDateString("tr-TR", {
            day: "numeric", month: "short"
          })}
        </div>
        
        {/* Konum */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-800 shadow-sm flex items-center">
          <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1" />
          {shortLocation}
        </div>
      </div>

      {/* İçerik Kısmı */}
      <div className="p-5 flex-grow">
        <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
          {event.title}
        </h2>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{event.description}</p>
        
        {/* Alt Bilgiler */}
        <div className="mt-auto pt-4 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-400 mr-1.5" />
            <span>120+ kişi</span>
          </div>
          
          <div className="flex items-center text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
            <span>Detayları Gör</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
