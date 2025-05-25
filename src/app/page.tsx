'use client';

import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import EventsSection from '@/components/home/EventsSection';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import CTASection from '@/components/home/CTASection';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem } from '@/lib/firestoreAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useFirestoreAuthContext();

  // Giriş yapmış kullanıcıyı doğru panele yönlendir
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const userRole = safeGetItem('user_role') || 'user';
      
      // Role göre yönlendirme
      if (userRole === 'admin') {
        router.push('/dashboard');
      } else if (userRole === 'coreteam') {
        router.push('/dashboard/coreteam');
      } else {
        router.push('/dashboard/user');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <EventsSection />
        <CommunitiesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
