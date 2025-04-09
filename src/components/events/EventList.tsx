"use client";

import React, { useState } from "react";
import { eventsData, Event } from "@/data/eventsData";
import EventCard from "@/components/events/EventCard";
import EventModal from "@/components/events/EventModal";
import { CalendarDays } from "lucide-react";

const EventList = () => {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const now = new Date();

  const filteredEvents = eventsData
    .filter((event) => {
      const eventDate = new Date(event.date);
      return filter === "upcoming" ? eventDate >= now : eventDate < now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    <div className="p-6 max-w-6xl mx-auto relative">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        🎯 Etkinlik Takvimi
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        {["upcoming", "past"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key as "upcoming" | "past")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {key === "upcoming" ? "Yaklaşan Etkinlikler" : "Geçmiş Etkinlikler"}
          </button>
        ))}
      </div>

      {Object.keys(groupedEvents).map((date) => (
        <div key={date} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-blue-600 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-700">{date}</h2>
            <div className="h-[2px] flex-1 bg-blue-100 ml-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedEvents[date].map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
