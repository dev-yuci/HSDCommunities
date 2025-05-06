import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EventList from '@/components/dashboard/events/EventList';

export default function EventsPage() {
  return (
    <div>
      <DashboardHeader 
        title="Etkinlikler" 
        description="Etkinlikleri görüntüle, ekle, düzenle ve yönet"
      />
      
      <div className="mt-6">
        <EventList />
      </div>
    </div>
  );
} 