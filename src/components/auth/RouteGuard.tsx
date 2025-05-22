'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem } from '@/lib/firestoreAuth';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: string; // Belirli sayfalar için rol kısıtlaması eklenebilir
}

export default function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { user, loading, role } = useFirestoreAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAuth, setHasAuth] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);

  useEffect(() => {
    // Yükleme tamamlandıysa kontrol yap
    if (!loading) {
      // Token veya kullanıcı kontrolü
      const token = safeGetItem('auth_token');
      const isAuthenticated = !!user || !!token;
      setHasAuth(isAuthenticated);

      // Rol kontrolü (eğer bir rol gerekiyorsa)
      if (requiredRole && isAuthenticated) {
        // Kullanıcı rolünü kontrol et
        const userRole = user?.role || safeGetItem('user_role') || 'guest';
        const hasRole = userRole === requiredRole;
        setHasRequiredRole(hasRole);

        // Gerekli role sahip değilse dashboard'a yönlendir
        if (!hasRole) {
          console.log('Yetkiniz yok, ana sayfaya yönlendiriliyor...');
          
          if (isChecking) {
            setIsChecking(false);
            router.push('/dashboard');
            
            setTimeout(() => {
              if (isBrowser()) {
                window.location.href = '/dashboard';
              }
            }, 500);
          }
          return;
        }
      }

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
  }, [user, loading, router, isChecking, requiredRole, role]);

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

  // Kullanıcı veya token yoksa veya gerekli role sahip değilse içerik gösterme
  if (!hasAuth || !hasRequiredRole) {
    return null;
  }

  // Kullanıcı oturum açmış ve gerekli role sahipse içeriği göster
  return <>{children}</>;
} 