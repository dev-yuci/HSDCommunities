import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-config';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // URL'den etkinlik ID'sini al
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Etkinlik ID parametresi gereklidir' },
        { status: 400 }
      );
    }

    // Etkinliğe kayıt olanları getir
    const registrationsQuery = query(
      collection(db, 'eventRegistrations'),
      where('eventId', '==', eventId)
    );

    const registrationsSnapshot = await getDocs(registrationsQuery);
    
    if (registrationsSnapshot.empty) {
      // Kayıt yok, boş liste döndür
      return NextResponse.json({ registrations: [] });
    }

    // Kayıtlı kullanıcıların bilgilerini topla
    const registrationsWithUserInfo = [];
    
    for (const registrationDoc of registrationsSnapshot.docs) {
      const registrationData = registrationDoc.data();
      const userId = registrationData.userId;
      
      try {
        // Kullanıcı bilgilerini getir
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          registrationsWithUserInfo.push({
            registrationId: registrationDoc.id,
            userId: userId,
            registeredAt: registrationData.registeredAt,
            displayName: userData.displayName || null,
            email: userData.email || null,
          });
        } else {
          // Kullanıcı bulunamadıysa sadece kayıt bilgilerini ekle
          registrationsWithUserInfo.push({
            registrationId: registrationDoc.id,
            userId: userId,
            registeredAt: registrationData.registeredAt,
          });
        }
      } catch (error) {
        console.error(`Kullanıcı bilgileri alınırken hata: ${error}`);
        // Hata durumunda da kayıt bilgilerini ekle
        registrationsWithUserInfo.push({
          registrationId: registrationDoc.id,
          userId: userId,
          registeredAt: registrationData.registeredAt,
        });
      }
    }
    
    // Sonuçları döndür
    return NextResponse.json({ 
      registrations: registrationsWithUserInfo 
    });
    
  } catch (error) {
    console.error('Kayıt bilgileri alınırken hata:', error);
    return NextResponse.json(
      { error: 'Kayıt bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 