import { NextResponse } from 'next/server';
import { sendEventRegistrationEmail } from '@/lib/mailer';

// POST /api/send-mail
export async function POST(request: Request) {
  try {
    // İstek gövdesini al
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.email || !body.eventTitle || !body.eventDate || !body.eventLocation || !body.userName) {
      return NextResponse.json(
        { error: 'Eksik parametreler: email, eventTitle, eventDate, eventLocation ve userName zorunludur' },
        { status: 400 }
      );
    }
    
    // E-posta gönder
    const result = await sendEventRegistrationEmail(body.email, {
      title: body.eventTitle,
      date: new Date(body.eventDate),
      location: body.eventLocation,
      userName: body.userName
    });
    
    // Sonucu kontrol et
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'E-posta başarıyla gönderildi',
        messageId: result.messageId 
      });
    } else {
      // Başarısız sonuç durumunda
      return NextResponse.json(
        { success: false, error: 'E-posta gönderilemedi' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 