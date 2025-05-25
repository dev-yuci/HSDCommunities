import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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

// Middleware için cookie okuma fonksiyonu
export const safeGetCookie = (cookies: ReadonlyRequestCookies, name: string): string | null => {
  try {
    const cookie = cookies.get(name);
    return cookie?.value || null;
  } catch (error) {
    console.error(`Cookie okuma hatası (${name}):`, error);
    return null;
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
  photoURL?: string;
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

// Kullanıcı bilgilerini güncelleme fonksiyonu
export const updateUserProfile = async (email: string, updateData: {
  displayName?: string;
  password?: string;
  // role güncellemesi yalnızca admin tarafından yapılabilir
}) => {
  try {
    // Önce kullanıcının admin mi yoksa normal kullanıcı mı olduğunu belirle
    const isAdmin = email === safeGetItem('user_email') && safeGetItem('user_role') === 'admin';
    
    if (isAdmin) {
      // Admin profili güncelleme
      const authDocRef = doc(db, 'auth', 'hsd-auth');
      const authDocSnap = await getDoc(authDocRef);
      
      if (authDocSnap.exists()) {
        const currentData = authDocSnap.data() as UserData;
        
        // Sadece sağlanan alanları güncelle
        const updatedData: Partial<UserData> = {};
        
        if (updateData.displayName) {
          updatedData.displayName = updateData.displayName;
          // LocalStorage'ı da güncelle
          safeSetItem('user_name', updateData.displayName);
        }
        
        if (updateData.password) {
          updatedData.password = updateData.password;
        }
        
        // Firestore'da güncelle
        await updateDoc(authDocRef, updatedData);
        
        return { success: true, error: null };
      }
    } else {
      // Normal kullanıcı profili güncelleme
      const userDocRef = doc(db, 'users', email);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const currentData = userDocSnap.data() as UserData;
        
        // Sadece sağlanan alanları güncelle
        const updatedData: Partial<UserData> = {};
        
        if (updateData.displayName) {
          updatedData.displayName = updateData.displayName;
          // LocalStorage'ı da güncelle
          safeSetItem('user_name', updateData.displayName);
        }
        
        if (updateData.password) {
          updatedData.password = updateData.password;
        }
        
        // Firestore'da güncelle
        await updateDoc(userDocRef, updatedData);
        
        return { success: true, error: null };
      } else {
        return { 
          success: false, 
          error: { code: 'auth/user-not-found', message: 'Kullanıcı bulunamadı' } 
        };
      }
    }
    
    return { 
      success: false, 
      error: { code: 'auth/unknown-error', message: 'Bilinmeyen bir hata oluştu' } 
    };
  } catch (error: any) {
    console.error('Profil güncelleme hatası:', error);
    return { success: false, error };
  }
};

export { db }; 