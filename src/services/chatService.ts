import { 
  collection, 
  addDoc,
  doc,
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp,
  serverTimestamp,
  getDocs,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  content: string;
  createdAt: Date;
  isEdited?: boolean;
}

const COLLECTION_NAME = 'coreTeamChat';

// Mesaj gönderme
export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
  try {
    // undefined değerleri filtrele
    const messageData = Object.entries({
      ...message,
      createdAt: serverTimestamp(),
      isEdited: false
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), messageData);
    return docRef.id;
  } catch (error) {
    console.error('Mesaj gönderilirken hata oluştu:', error);
    throw error;
  }
};

// Mesaj düzenleme
export const editMessage = async (messageId: string, content: string) => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, messageId);
    await updateDoc(messageRef, { 
      content, 
      isEdited: true 
    });
  } catch (error) {
    console.error('Mesaj düzenlenirken hata oluştu:', error);
    throw error;
  }
};

// Mesaj silme
export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Mesaj silinirken hata oluştu:', error);
    throw error;
  }
};

// Belirli bir kullanıcının mesajlarını getir
export const getUserMessages = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore Timestamp'ı JavaScript Date'e çevirme
      const createdAt = data.createdAt ? 
        (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt)) 
        : new Date();
      
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userPhotoURL: data.userPhotoURL,
        content: data.content,
        createdAt,
        isEdited: data.isEdited || false
      };
    });
  } catch (error) {
    console.error('Kullanıcı mesajları getirilirken hata oluştu:', error);
    throw error;
  }
};

// Tüm mesajları gerçek zamanlı olarak dinle
export const subscribeToMessages = (
  callback: (messages: ChatMessage[]) => void, 
  messagesLimit = 50
) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(messagesLimit)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore Timestamp'ı JavaScript Date'e çevirme
        const createdAt = data.createdAt ? 
          (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt)) 
          : new Date();
        
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          content: data.content,
          createdAt,
          isEdited: data.isEdited || false
        };
      });
      
      // Mesajları en yeniden eskiye doğru sırala
      const sortedMessages = [...messages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      
      callback(sortedMessages);
    });
  } catch (error) {
    console.error('Mesajlar dinlenirken hata oluştu:', error);
    throw error;
  }
}; 