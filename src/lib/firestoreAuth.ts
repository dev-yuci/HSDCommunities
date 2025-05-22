import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

// localStorage'a güvenli erişim sağlayan yardımcı fonksiyonlar
export const safeGetItem = (key: string): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
};

export const safeSetItem = (key: string, value: string): void => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
};

export const safeRemoveItem = (key: string): void => {
  if (isBrowser()) {
    localStorage.removeItem(key);
  }
};

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyA0JUa-hUkaIfbXLMvntJ6Lfg3cvhvYhVo",
  authDomain: "hsd-communities.firebaseapp.com",
  projectId: "hsd-communities",
  storageBucket: "hsd-communities.firebasestorage.app",
  messagingSenderId: "492790104716",
  appId: "1:492790104716:web:1ecd22b5073765117fb1a9"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore ile kimlik doğrulama işlemleri
export interface UserData {
  email: string;
  password: string;
  role: string;
  displayName?: string;
}

// Özel kullanıcı tipi
export interface CustomUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}

// Firestore'dan kullanıcı bilgilerini kontrol et
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Önce 'auth/hsd-auth' belgesini kontrol et (admin için)
    const authDocRef = doc(db, 'auth', 'hsd-auth');
    const authDocSnap = await getDoc(authDocRef);

    // Admin hesabı kontrolü
    if (authDocSnap.exists()) {
      const adminData = authDocSnap.data() as UserData;
      
      if (adminData.email === email && adminData.password === password) {
        // Admin hesabına giriş başarılı
        const customUser: CustomUser = {
          uid: 'hsd-admin-id',
          email: adminData.email,
          displayName: adminData.displayName || 'HSD Admin',
          role: adminData.role || 'admin'
        };
        
        return { 
          user: customUser, 
          error: null 
        };
      }
    }
    
    // Normal kullanıcı kontrolü - 'users' koleksiyonunda email'e göre ara
    const userDocRef = doc(db, 'users', email);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserData;
      
      if (userData.email === email && userData.password === password) {
        // Kullanıcı bilgileri eşleşti - kullanıcı nesnesini döndür
        const customUser: CustomUser = {
          uid: email, // Email'i uid olarak kullanabiliriz
          email: userData.email,
          displayName: userData.displayName || 'HSD Kullanıcı',
          role: userData.role || 'user'
        };
        
        return { 
          user: customUser, 
          error: null 
        };
      } else {
        // Şifre eşleşmedi
        return { 
          user: null, 
          error: { code: 'auth/wrong-credentials', message: 'E-posta veya şifre hatalı' } 
        };
      }
    } else {
      // Kullanıcı bulunamadı
      return { 
        user: null, 
        error: { code: 'auth/user-not-found', message: 'Bu e-posta adresine sahip kullanıcı bulunamadı' } 
      };
    }
  } catch (error: any) {
    console.error('Firestore giriş hatası:', error);
    return { user: null, error };
  }
};

// Kullanıcı oturum durumunu manuel olarak izleme
// Gerçek bir izleme fonksiyonu değil, localStorage'dan bilgileri okuyoruz
export const getCurrentUser = (): CustomUser | null => {
  const userId = safeGetItem('auth_token');
  const email = safeGetItem('user_email');
  const displayName = safeGetItem('user_name');
  const role = safeGetItem('user_role');

  if (!userId || !email) return null;

  return {
    uid: userId,
    email,
    displayName: displayName || 'HSD Kullanıcı',
    role: role || 'user'
  };
};

// Oturum kapatma işlemi - sadece yerel depolama temizlenir
export const logoutUser = async () => {
  try {
    // LocalStorage temizleniyor
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Çıkış yapılırken hata:', error);
    return { success: false, error };
  }
};

export { db }; 