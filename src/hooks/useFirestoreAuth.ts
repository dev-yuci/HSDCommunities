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

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

export const useFirestoreAuth = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kullanıcı oturum durumunu yükle
  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini yükleme
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);

      // Kullanıcı varsa ve şu anda login sayfasındaysa rol kontrolüne göre yönlendir
      if (currentUser && isBrowser() && window.location.pathname === '/login') {
        setTimeout(() => {
          // Admin ise dashboard'a yönlendir
          if (currentUser.role === 'admin') {
            router.push('/dashboard');
          } else {
            // Diğer roller için farklı sayfalar tanımlanabilir
            router.push('/dashboard');
          }
          
          // Yedek yönlendirme - router.push çalışmazsa
          setTimeout(() => {
            if (isBrowser() && window.location.pathname === '/login') {
              window.location.href = '/dashboard';
            }
          }, 500);
        }, 0);
      }
    };

    loadUser();
  }, [router]);

  // Email/şifre ile giriş
  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await loginWithEmailAndPassword(email, password);
    
    if (result.user) {
      setUser(result.user);
      
      // Kullanıcı bilgilerini LocalStorage'e kaydet
      safeSetItem('auth_token', result.user.uid);
      safeSetItem('user_name', result.user.displayName);
      safeSetItem('user_email', result.user.email);
      safeSetItem('user_role', result.user.role);
    }
    
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
    logout,
    hasToken,
    isAuthenticated,
    role: user?.role || 'guest'
  };
}; 