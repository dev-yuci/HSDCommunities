import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyA0JUa-hUkaIfbXLMvntJ6Lfg3cvhvYhVo",
  authDomain: "hsd-communities.firebaseapp.com",
  projectId: "hsd-communities",
  storageBucket: "hsd-communities.firebasestorage.app",
  messagingSenderId: "492790104716",
  appId: "1:492790104716:web:1ecd22b5073765117fb1a9"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini dışa aktar
export const db = getFirestore(app);
export const auth = getAuth(app); 