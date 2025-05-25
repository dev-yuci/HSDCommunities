import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
  FieldValue
} from 'firebase/firestore';
import { db } from './firebase-config';

// Etkinlik tipi tanımı
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | Timestamp;
  location: string;
  imageUrl: string;
  category: string;
  capacity: number;
  registeredCount: number;
  isRegistered?: boolean; // İsteğe bağlı özellik
  createdAt?: Timestamp | FieldValue; // İsteğe bağlı özellik
  updatedAt?: Timestamp | FieldValue; // İsteğe bağlı özellik
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'; // Etkinlik durumu
}

// Firestore'dan gelen event verisini uygulama için uygun formata dönüştürme
export const formatEvent = (data: DocumentData, id: string): Event => {
  // Firestore timestamp'ını Date nesnesine dönüştür
  const dateValue = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
  
  return {
    id,
    title: data.title || '',
    description: data.description || '',
    date: dateValue,
    location: data.location || '',
    imageUrl: data.imageUrl || '',
    category: data.category || '',
    capacity: data.capacity || 0,
    registeredCount: data.registeredCount || 0,
    // İsteğe bağlı alanlar
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

// Event nesnesini Firestore'a kaydetmek için dönüştürme
export const prepareEventForFirestore = (event: Partial<Event>) => {
  const eventData: any = { ...event };
  
  // Date nesnesini Firestore timestamp'a dönüştür
  if (event.date instanceof Date) {
    eventData.date = Timestamp.fromDate(event.date);
  }
  
  // id'yi çıkar (Firestore dökümanının ID'si olarak kullanılacak)
  if ('id' in eventData) delete eventData.id;
  
  // isRegistered özelliğini çıkar (sadece UI için kullanılıyor)
  if ('isRegistered' in eventData) delete eventData.isRegistered;
  
  return eventData;
};

// Tüm etkinlikleri getir
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(eventsQuery);
    
    if (snapshot.empty) {
      console.log('Etkinlik bulunamadı');
      return [];
    }
    
    console.log(`${snapshot.docs.length} etkinlik bulundu`);
    return snapshot.docs.map(doc => formatEvent(doc.data(), doc.id));
  } catch (error) {
    console.error('Etkinlikler alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir kategori için etkinlikleri getir
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    console.log(`${category} kategorisindeki etkinlikler getiriliyor...`);
    
    const eventsQuery = query(
      collection(db, 'events'),
      where('category', '==', category),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(eventsQuery);
    
    console.log(`${category} kategorisinde ${snapshot.docs.length} etkinlik bulundu`);
    return snapshot.docs.map(doc => formatEvent(doc.data(), doc.id));
  } catch (error) {
    console.error(`${category} kategorisindeki etkinlikler alınırken hata oluştu:`, error);
    return [];
  }
};

// Gelecek etkinlikleri getir
export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    console.log('Gelecek etkinlikler getiriliyor...');
    
    // Şu anki tarihi Firestore timestamp olarak al
    const now = Timestamp.fromDate(new Date());
    
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(eventsQuery);
    
    console.log(`${snapshot.docs.length} etkinlik bulundu`);
    
    // Firestore where('date', '>=', now) sorgusunda sorun olabileceği için
    // tüm etkinlikleri getirip JS tarafında filtreleme yapıyoruz
    const events = snapshot.docs.map(doc => formatEvent(doc.data(), doc.id));
    
    // Test amaçlı tüm etkinlikleri dön
    return events;
    
    // Filtreleme (sonraki aşamada açılabilir)
    // return events.filter(event => {
    //  if (event.date instanceof Date) {
    //    return event.date >= new Date();
    //  } else if (event.date instanceof Timestamp) {
    //    return event.date.toDate() >= new Date();
    //  }
    //  return false;
    // });
  } catch (error) {
    console.error('Gelecek etkinlikler alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir etkinliği ID'ye göre getir
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, 'events', eventId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return formatEvent(docSnap.data(), docSnap.id);
    }
    return null;
  } catch (error) {
    console.error(`Etkinlik (ID: ${eventId}) alınırken hata oluştu:`, error);
    return null;
  }
};

// Yeni etkinlik ekle
export const addEvent = async (eventData: Omit<Event, 'id'>): Promise<string | null> => {
  try {
    // Firestore için veriyi hazırla
    const data = prepareEventForFirestore({
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      registeredCount: 0
    });
    
    // Otomatik ID ile dokuman oluştur
    const docRef = await addDoc(collection(db, 'events'), data);
    return docRef.id;
  } catch (error) {
    console.error('Etkinlik eklenirken hata oluştu:', error);
    return null;
  }
};

// Var olan etkinliği güncelle
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<boolean> => {
  try {
    // Firestore için veriyi hazırla
    const data = prepareEventForFirestore({
      ...eventData,
      updatedAt: serverTimestamp()
    });
    
    await updateDoc(doc(db, 'events', eventId), data);
    return true;
  } catch (error) {
    console.error(`Etkinlik (ID: ${eventId}) güncellenirken hata oluştu:`, error);
    return false;
  }
};

// Etkinliği sil
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
    return true;
  } catch (error) {
    console.error(`Etkinlik (ID: ${eventId}) silinirken hata oluştu:`, error);
    return false;
  }
};

// Örnek etkinlikleri Firestore'a yükle (Sadece ilk kurulum için)
export const seedEvents = async (events: Omit<Event, 'id'>[]): Promise<string[]> => {
  try {
    const eventIds: string[] = [];
    
    for (const event of events) {
      const data = prepareEventForFirestore({
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const docRef = await addDoc(collection(db, 'events'), data);
      eventIds.push(docRef.id);
    }
    
    return eventIds;
  } catch (error) {
    console.error('Örnek etkinlikler yüklenirken hata oluştu:', error);
    return [];
  }
};

// Kullanıcının kayıtlı olduğu etkinlikleri getir
export const getUserRegisteredEvents = async (userId: string): Promise<Event[]> => {
  try {
    // Önce kullanıcının kayıtlı olduğu etkinlik ID'lerini al
    const registrationsQuery = query(
      collection(db, 'eventRegistrations'),
      where('userId', '==', userId)
    );
    
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const eventIds = registrationsSnapshot.docs.map(doc => doc.data().eventId);
    
    // Her bir etkinlik ID'si için etkinlik verilerini al
    const events: Event[] = [];
    
    for (const eventId of eventIds) {
      const event = await getEventById(eventId);
      if (event) {
        events.push({
          ...event,
          isRegistered: true
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error(`Kullanıcının (ID: ${userId}) kayıtlı etkinlikleri alınırken hata oluştu:`, error);
    return [];
  }
}; 