'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem } from '@/lib/firestoreAuth';
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EventList from '@/components/dashboard/events/EventList';
import { toast } from 'react-hot-toast';

export default function EventsPage() {
  const router = useRouter();
  const { user, loading } = useFirestoreAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    const checkUserRole = () => {
      try {
        // Sayfa yüklendiğinde hemen kullanıcı rolünü kontrol et
        const userRole = safeGetItem('user_role');
        console.log('Kullanıcı rolü:', userRole);
        
        if (userRole === 'admin') {
          setIsAdmin(true);
        } else {
          // Normal kullanıcıları hemen profil sayfasına yönlendir
          setIsAdmin(false);
          console.log('Admin olmayan kullanıcı, profil sayfasına yönlendiriliyor');
          // Anında yönlendirme yap
          router.replace('/dashboard/profile');
        }
      } catch (error) {
        console.error('Kullanıcı rolü kontrol edilirken hata:', error);
        toast.error('Bir hata oluştu. Lütfen tekrar giriş yapın.');
        router.replace('/login');
      } finally {
        setPageLoading(false);
      }
    };
    
    // Auth yüklenmesi tamamlandığında
    if (!loading) {
      checkUserRole();
    }
  }, [router, loading, user]);
  
  // Sayfa yüklenirken veya kullanıcı rolü kontrol edilirken yükleme göster
  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Eğer admin olmayan bir kullanıcı ise hiçbir şey gösterme
  if (isAdmin === false) {
    return null;
  }
  
  // Admin kullanıcılar için etkinlikler sayfasını göster
  return (
    <div>
      <DashboardHeader 
        title="Etkinlikler" 
        description="Tüm etkinlikleri görüntüle ve yönet"
      />
      
      <div className="mt-6">
        <EventList />
      </div>
    </div>
  );
} 