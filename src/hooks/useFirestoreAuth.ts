'use client';

import { useState, useEffect } from 'react';
import { 
  getCurrentUser,
  loginWithEmailAndPassword, 
  logoutUser,
  CustomUser,
  safeGetItem,
  safeSetItem,
  safeRemoveItem
} from '@/lib/firestoreAuth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

// Cookie'leri güvenli bir şekilde ayarla ve sil
const setCookie = (name: string, value: string, days = 7) => {
  if (isBrowser()) {
    try {
      // Önce mevcut cookie'yi temizleyelim
      Cookies.remove(name, { path: '/' });
      // Sonra yeni değeri ayarlayalım
      Cookies.set(name, value, { 
        expires: days, 
        path: '/',
        sameSite: 'strict' 
      });
      console.log(`Cookie set: ${name}`);
    } catch (error) {
      console.error(`Cookie ayarlanırken hata: ${name}`, error);
    }
  }
};

const removeCookie = (name: string) => {
  if (isBrowser()) {
    try {
      Cookies.remove(name, { path: '/' });
      console.log(`Cookie removed: ${name}`);
    } catch (error) {
      console.error(`Cookie silinirken hata: ${name}`, error);
    }
  }
};

// Tüm kullanıcı oturum bilgilerini ayarla
const setUserData = (user: CustomUser) => {
  // LocalStorage'a kaydet
  safeSetItem('auth_token', user.uid);
  safeSetItem('user_name', user.displayName);
  safeSetItem('user_email', user.email);
  safeSetItem('user_role', user.role);
  
  // Cookie'lere kaydet
  setCookie('auth_token', user.uid);
  setCookie('user_name', user.displayName);
  setCookie('user_email', user.email);
  setCookie('user_role', user.role);

  console.log('Tüm kullanıcı bilgileri kaydedildi:', user.role);
};

// Tüm kullanıcı oturum bilgilerini temizle
const clearUserData = () => {
  // LocalStorage'dan temizle
  safeRemoveItem('auth_token');
  safeRemoveItem('user_name');
  safeRemoveItem('user_email');
  safeRemoveItem('user_role');
  safeRemoveItem('remember_me');
  
  // Cookie'lerden temizle
  removeCookie('auth_token');
  removeCookie('user_name');
  removeCookie('user_email');
  removeCookie('user_role');

  console.log('Tüm kullanıcı bilgileri temizlendi');
};

export const useFirestoreAuth = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kullanıcı oturum durumunu yükle
  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini yükleme
    const loadUser = () => {
      try {
        const currentUser = getCurrentUser();
        
        if (currentUser) {
          console.log('Kullanıcı yüklendi:', currentUser.role);
          
          // Cookie'leri yeniden ayarla (sync işlemi)
          setUserData(currentUser);
        } else {
          console.log('Yüklenen kullanıcı bilgisi yok');
        }
        
        setUser(currentUser);
        setLoading(false);

        // Kullanıcı varsa ve şu anda login sayfasındaysa rol kontrolüne göre yönlendir
        if (currentUser && isBrowser() && window.location.pathname === '/login') {
          setTimeout(() => {
            // Admin ise dashboard'a yönlendir
            if (currentUser.role === 'admin') {
              router.replace('/dashboard');
            } else if (currentUser.role === 'coreteam') {
              router.replace('/dashboard/coreteam');
            } else {
              // Normal kullanıcılar için user paneline doğrudan yönlendir
              router.replace('/dashboard/user');
            }
          }, 0);
        }
      } catch (error) {
        console.error('Kullanıcı yüklenirken hata:', error);
        setUser(null);
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // Email/şifre ile giriş
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginWithEmailAndPassword(email, password);
      
      if (result.user) {
        setUser(result.user);
        
        // Kullanıcı bilgilerini kaydet
        setUserData(result.user);
        
        console.log('Giriş başarılı, rol:', result.user.role);
      } else {
        console.log('Giriş başarısız');
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Giriş işlemi sırasında hata:', error);
      setLoading(false);
      return { user: null, error };
    }
  };

  // Çıkış yap
  const logout = async () => {
    try {
      // Önce tüm storage verilerini temizle
      clearUserData();
      
      setLoading(true);
      const result = await logoutUser();
      
      // Kullanıcı durumunu null yap
      setUser(null);
      setLoading(false);
      
      // Yönlendirmeyi sadece başarılı çıkış durumunda yap
      if (result.success) {
        // setTimeout kullanarak yönlendirme işlemini state güncellemelerinden sonraya bırak
        setTimeout(() => {
          router.replace('/login');
        }, 100);
      }
      
      return result;
    } catch (error) {
      console.error('Çıkış işlemi sırasında hata:', error);
      setLoading(false);
      return { success: false, error };
    }
  };

  // Token durumu - sadece client side'da çalışır
  const hasToken = (): boolean => {
    try {
      // Hem localStorage hem de cookie kontrolü yap
      return !!safeGetItem('auth_token') || !!Cookies.get('auth_token');
    } catch (error) {
      console.error('Token kontrolü sırasında hata:', error);
      return false;
    }
  };

  // Client tarafında olup olmadığımızı ve isAuthenticated değerini useEffect ile takip edelim
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    try {
      const isAuth = !!user || hasToken();
      setIsAuthenticated(isAuth);
      console.log('Yetkilendirme durumu:', isAuth);
    } catch (error) {
      console.error('Yetkilendirme kontrolü sırasında hata:', error);
      setIsAuthenticated(false);
    }
  }, [user]);

  return {
    user,
    loading,
    login,
    logout,
    hasToken,
    isAuthenticated,
    role: user?.role || 'guest'
  };
}; 