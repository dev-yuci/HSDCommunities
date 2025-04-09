// components/events/EventModal.tsx
import React from "react";
import { Event } from "@/data/eventsData";
import { CalendarDays, MapPin, X } from "lucide-react";

interface Props {
  event: Event;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          {event.title}
        </h2>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <CalendarDays className="w-5 h-5" />
          <span>
            {new Date(event.date).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <MapPin className="w-5 h-5" />
          <span>{event.location}</span>
        </div>

        <p className="text-gray-800 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
};

export default EventModal;
