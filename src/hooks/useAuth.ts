import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  subscribeToAuthChanges, 
  loginWithEmailAndPassword, 
  loginWithGoogle, 
  logoutUser 
} from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

// localStorage'a güvenli erişim sağlayan yardımcı fonksiyonlar
const safeGetItem = (key: string): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
};

const safeSetItem = (key: string, value: string): void => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
};

const safeRemoveItem = (key: string): void => {
  if (isBrowser()) {
    localStorage.removeItem(key);
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kullanıcı oturum durumunu izle
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      // Kullanıcı bilgilerini LocalStorage'e kaydet
      if (firebaseUser) {
        safeSetItem('auth_token', firebaseUser.uid);
        safeSetItem('user_name', firebaseUser.displayName || 'Kullanıcı');
        safeSetItem('user_email', firebaseUser.email || '');
        
        // Rol bilgisi - gerçek projelerde rol yönetimi genellikle veritabanından gelir
        safeSetItem('user_role', 'user');

        // Kullanıcı giriş yaptıysa ve şu anda login sayfasındaysa dashboard'a yönlendir
        if (isBrowser() && window.location.pathname === '/login') {
          setTimeout(() => {
            router.push('/dashboard');
            
            // Yedek yönlendirme - router.push çalışmazsa
            setTimeout(() => {
              if (isBrowser() && window.location.pathname !== '/dashboard') {
                window.location.href = '/dashboard';
              }
            }, 500);
          }, 0);
        }
      } else {
        // Kullanıcı oturumu kapatmışsa bilgileri temizle
        safeRemoveItem('auth_token');
        safeRemoveItem('user_name');
        safeRemoveItem('user_email');
        safeRemoveItem('user_role');
        safeRemoveItem('remember_me');
      }
    });

    // Cleanup fonksiyonu
    return () => unsubscribe();
  }, [router]);

  // Email/şifre ile giriş
  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await loginWithEmailAndPassword(email, password);
    setLoading(false);
    return result;
  };

  // Google ile giriş
  const loginGoogle = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    return result;
  };

  // Çıkış yap
  const logout = async () => {
    // Önce LocalStorage temizleme işlemini elle yapalım
    safeRemoveItem('auth_token');
    safeRemoveItem('user_name');
    safeRemoveItem('user_email');
    safeRemoveItem('user_role');
    safeRemoveItem('remember_me');
    
    setLoading(true);
    const result = await logoutUser();
    setLoading(false);
    
    // Önce kullanıcı durumunu null yap, ardından yönlendir
    setUser(null);
    
    // Yönlendirmeyi sadece başarılı çıkış durumunda yap
    if (result.success) {
      // setTimeout kullanarak yönlendirme işlemini state güncellemelerinden sonraya bırak
      setTimeout(() => {
        // İki yönlendirme yöntemini de deneyelim
        // 1. Next.js router ile
        router.push('/login');
        
        // 2. Doğrudan URL değişikliği ile (router.push çalışmazsa)
        setTimeout(() => {
          if (isBrowser()) {
            window.location.href = '/login';
          }
        }, 300);
      }, 100);
    }
    
    return result;
  };

  // Token durumu - sadece client side'da çalışır
  const hasToken = (): boolean => {
    return !!safeGetItem('auth_token');
  };

  // Client tarafında olup olmadığımızı ve isAuthenticated değerini useEffect ile takip edelim
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(!!user || hasToken());
  }, [user]);

  return {
    user,
    loading,
    login,
    loginGoogle,
    logout,
    hasToken,
    isAuthenticated
  };
}; 