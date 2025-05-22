'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

// localStorage'a güvenli erişim sağlayan yardımcı fonksiyon
const safeGetItem = (key: string): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
};

interface RouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    // Yükleme tamamlandıysa kontrol yap
    if (!loading) {
      // Token veya kullanıcı kontrolü
      const token = safeGetItem('auth_token');
      const isAuthenticated = !!user || !!token;
      setHasAuth(isAuthenticated);

      // Kullanıcı oturum açmamışsa login sayfasına yönlendir
      if (!isAuthenticated) {
        console.log('Oturum açılmamış, giriş sayfasına yönlendiriliyor...');
        
        // Yönlendirmeyi sadece bir kez yap
        if (isChecking) {
          setIsChecking(false);
          
          // İki yönlendirme yöntemini de deneyelim
          // 1. Next.js router ile
          router.push('/login');
          
          // 2. Doğrudan URL değişikliği ile - router.push çalışmazsa bu çalışır
          setTimeout(() => {
            if (isBrowser() && window.location.pathname.startsWith('/dashboard')) {
              window.location.href = '/login';
            }
          }, 500);
        }
      } else {
        // Kullanıcı oturum açmışsa kontrol işlemini tamamla
        setIsChecking(false);
      }
    }
  }, [user, loading, router, isChecking]);

  // Yükleme sırasında veya kontrol sürerken yükleme göster
  if (loading || isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı veya token yoksa içerik gösterme 
  if (!hasAuth) {
    return null;
  }

  // Kullanıcı oturum açmışsa içeriği göster
  return <>{children}</>;
} 