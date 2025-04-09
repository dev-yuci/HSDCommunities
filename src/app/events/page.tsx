import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventList from "@/components/events/EventList";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <EventList />
      </main>
      <Footer />
    </div>
  );
}
