// Firebase yapılandırma dosyası
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase yapılandırma bilgileri - bunları kendi Firebase projenizden almalısınız
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Authentication işlemleri için yardımcı fonksiyonlar
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Firebase giriş hatası:', error);
    return { user: null, error };
  }
};

export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Google ile giriş hatası:', error);
    return { user: null, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Çıkış yapılırken hata:', error);
    return { success: false, error };
  }
};

// Kullanıcı oturum durumu izleme
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth }; 