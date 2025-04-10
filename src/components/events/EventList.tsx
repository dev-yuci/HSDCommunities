"use client";

import React, { useState, useEffect } from "react";
import { eventsData, Event } from "@/data/eventsData";
import EventCard from "@/components/events/EventCard";
import EventModal from "@/components/events/EventModal";
import { CalendarDays, Search, X, Filter } from "lucide-react";

// Etkinlik kategorileri
const categories = [
  "Tümü",
  "Workshop",
  "Seminer",
  "Hackathon",
  "Panel",
  "Konferans",
  "Meetup"
];

// Kategorilere göre renk sınıfları
const categoryColors: Record<string, string> = {
  "Workshop": "bg-blue-100 text-blue-700",
  "Seminer": "bg-green-100 text-green-700",
  "Hackathon": "bg-purple-100 text-purple-700",
  "Panel": "bg-amber-100 text-amber-700", 
  "Konferans": "bg-red-100 text-red-700",
  "Meetup": "bg-teal-100 text-teal-700"
};

const EventList = () => {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const now = new Date();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtreleme işlemi
  const filteredEvents = eventsData
    .filter((event) => {
      // Zamanlamaya göre filtrele (yaklaşan/geçmiş)
      const eventDate = new Date(event.date);
      const timeFilter = filter === "upcoming" ? eventDate >= now : eventDate < now;
      
      // Kategoriye göre filtrele
      const categoryFilter = selectedCategory === "Tümü" || event.category === selectedCategory;
      
      // Arama sorgusuna göre filtrele
      const searchFilter = 
        searchQuery === "" || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return timeFilter && categoryFilter && searchFilter;
    })
    .sort((a, b) => {
      if (filter === "upcoming") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Tarih gruplandırması
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Filtreleme ve Arama */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Arama Kutusu */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              placeholder="Etkinlik ara..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Tarih Filtreleri */}
          <div className="flex gap-2">
            {["upcoming", "past"].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key as "upcoming" | "past")}
                className={`px-5 py-3 rounded-xl font-medium transition flex-1 lg:flex-none
                  ${filter === key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {key === "upcoming" ? "Yaklaşan Etkinlikler" : "Geçmiş Etkinlikler"}
              </button>
            ))}
          </div>
        </div>

        {/* Kategori Filtreleri */}
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <Filter className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Kategoriye Göre Filtrele</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : hoveredCategory === category
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-50 text-gray-700 border border-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {filter === "upcoming" ? "Yaklaşan Etkinlikler" : "Geçmiş Etkinlikler"}
          {selectedCategory !== "Tümü" && ` - ${selectedCategory}`}
        </h2>
        <div className="bg-blue-50 text-blue-700 py-1.5 px-3 rounded-full text-sm font-medium flex items-center">
          <CalendarDays className="w-4 h-4 mr-1.5" />
          {filteredEvents.length} etkinlik
        </div>
      </div>

      {/* Tarih gruplarına göre etkinlikler */}
      {Object.keys(groupedEvents).length > 0 ? (
        Object.keys(groupedEvents).map((date) => (
          <div key={date} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="text-blue-600 w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-700">{date}</h3>
              <div className="h-[2px] flex-1 bg-blue-100 ml-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedEvents[date].map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  categoryColor={categoryColors[event.category || "Workshop"] || "bg-gray-100 text-gray-700"}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
          <div className="mx-auto w-16 h-16 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <CalendarDays className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Etkinlik Bulunamadı</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `"${searchQuery}" araması için etkinlik bulunamadı.`
              : selectedCategory !== "Tümü"
              ? `${selectedCategory} kategorisinde etkinlik bulunamadı.`
              : "Belirtilen kriterlere uygun etkinlik bulunamadı."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Tümü");
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm Etkinlikleri Göster
          </button>
        </div>
      )}

      {/* Etkinlik Detay Modalı */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          categoryColor={categoryColors[selectedEvent.category || "Workshop"] || "bg-gray-100 text-gray-700"}
        />
      )}
    </div>
  );
};

export default EventList;
