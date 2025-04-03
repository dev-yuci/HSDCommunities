import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import EventsSection from '@/components/home/EventsSection';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <EventsSection />
        <CommunitiesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
