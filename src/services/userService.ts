import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  updateDoc,
  setDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'coreteam' | 'user';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  bio?: string;
  department?: string;
  joinedCommunities?: string[];
}

const COLLECTION_NAME = 'users';

// Firestore'dan gelen verileri uygun formata dönüştürme
const convertUserFromFirestore = (doc: any): User => {
  const data = doc.data();
  
  // Tarih alanlarını güvenli bir şekilde işleme
  let createdAt = new Date();
  if (data.createdAt) {
    if (typeof data.createdAt.toDate === 'function') {
      // Firestore Timestamp
      createdAt = data.createdAt.toDate();
    } else if (data.createdAt instanceof Date) {
      // Zaten Date nesnesi
      createdAt = data.createdAt;
    } else if (typeof data.createdAt === 'string') {
      // String ise Date'e çevir
      createdAt = new Date(data.createdAt);
    } else if (typeof data.createdAt === 'number') {
      // Unix timestamp ise (milisaniye cinsinden)
      createdAt = new Date(data.createdAt);
    }
  }
  
  // Son giriş tarihini güvenli bir şekilde işleme
  let lastLogin = undefined;
  if (data.lastLogin) {
    if (typeof data.lastLogin.toDate === 'function') {
      lastLogin = data.lastLogin.toDate();
    } else if (data.lastLogin instanceof Date) {
      lastLogin = data.lastLogin;
    } else if (typeof data.lastLogin === 'string') {
      lastLogin = new Date(data.lastLogin);
    } else if (typeof data.lastLogin === 'number') {
      lastLogin = new Date(data.lastLogin);
    }
  }
  
  return {
    id: doc.id,
    displayName: data.displayName || '',
    email: data.email || '',
    photoURL: data.photoURL,
    role: data.role || 'user',
    createdAt: createdAt,
    lastLogin: lastLogin,
    isActive: data.isActive !== false, // Varsayılan olarak aktif
    bio: data.bio,
    department: data.department,
    joinedCommunities: data.joinedCommunities || []
  };
};

// Tüm kullanıcıları getir
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('displayName')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertUserFromFirestore);
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata oluştu:', error);
    throw error;
  }
};

// Belirli bir role göre kullanıcıları getir
export const getUsersByRole = async (role: 'admin' | 'coreteam' | 'user'): Promise<User[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('role', '==', role),
      orderBy('displayName')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertUserFromFirestore);
  } catch (error) {
    console.error(`${role} rolündeki kullanıcılar getirilirken hata oluştu:`, error);
    throw error;
  }
};

// Kullanıcı detaylarını getir
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return convertUserFromFirestore(userDoc);
    }
    
    return null;
  } catch (error) {
    console.error('Kullanıcı detayları getirilirken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcı rolünü güncelle
export const updateUserRole = async (userId: string, newRole: 'admin' | 'coreteam' | 'user'): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, { role: newRole });
  } catch (error) {
    console.error('Kullanıcı rolü güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcıyı aktif/pasif yap
export const updateUserActiveStatus = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, { isActive });
  } catch (error) {
    console.error('Kullanıcı durumu güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Kullanıcı bilgilerini güncelle
export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    // Tarih alanlarını Firestore'a göndermeden önce kaldır
    const { id, createdAt, lastLogin, ...updateData } = userData;
    
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Örnek bir kullanıcı eklemek için (geliştirme amaçlı)
export const addSampleUser = async (userData: Partial<User>): Promise<string> => {
  try {
    // Benzersiz bir ID oluştur
    const userRef = doc(collection(db, COLLECTION_NAME));
    
    // Yeni kullanıcı verisi
    const newUser = {
      displayName: userData.displayName || 'Örnek Kullanıcı',
      email: userData.email || `ornek${Math.floor(Math.random() * 10000)}@ornek.com`,
      role: userData.role || 'user',
      createdAt: serverTimestamp(), // Server tarafında zaman damgası oluştur
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      // Diğer alanları ekle
      ...(userData.photoURL && { photoURL: userData.photoURL }),
      ...(userData.bio && { bio: userData.bio }),
      ...(userData.department && { department: userData.department }),
      ...(userData.joinedCommunities && { joinedCommunities: userData.joinedCommunities })
    };
    
    // Firestore'a kaydet
    await setDoc(userRef, newUser);
    
    return userRef.id;
  } catch (error) {
    console.error('Örnek kullanıcı eklenirken hata oluştu:', error);
    throw error;
  }
}; 