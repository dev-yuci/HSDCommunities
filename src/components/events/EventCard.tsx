// components/events/EventCard.tsx
import React from "react";
import { Event } from "@/data/eventsData";
import { CalendarDays, MapPin } from "lucide-react";

interface Props {
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-5 bg-white hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold text-blue-700 mb-1">{event.title}</h2>

      <div className="text-gray-600 text-sm flex items-center gap-1 mb-2">
        <CalendarDays className="w-4 h-4" />
        {new Date(event.date).toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <p className="text-gray-700 line-clamp-3">{event.description}</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="w-4 h-4" />
        {event.location}
      </div>
    </div>
  );
};

export default EventCard;
