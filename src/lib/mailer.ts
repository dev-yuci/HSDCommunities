import nodemailer from 'nodemailer';
import getConfig from 'next/config';
import QRCode from 'qrcode';

// Next.js yapılandırma bilgilerini al
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {
  serverRuntimeConfig: {},
  publicRuntimeConfig: { nodeEnv: process.env.NODE_ENV || 'development' }
};

// Gmail SMTP yapılandırması - doğrudan bilgiler kullanılıyor
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'hsdcommunities@gmail.com',
    pass: 'nxjpapqsdajuqmoe', // uygulama şifresi
  },
  from: '"HSD Communities" <hsdcommunities@gmail.com>',
};

// E-posta göndermek için transporter
let transporter: nodemailer.Transporter;

async function createTransporter() {
  // Gmail SMTP sunucusunu kullan
  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass,
    },
  });
}

// QR kod oluşturma fonksiyonu - Buffer olarak döndürür
async function generateQRCodeBuffer(data: string): Promise<Buffer> {
  try {
    // QR kodu buffer olarak oluştur
    return await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#2563eb', // QR kod rengi - mavi
        light: '#FFFFFF', // Arka plan rengi - beyaz
      },
    });
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
    throw error;
  }
}

// E-posta gönderme fonksiyonu
export const sendMail = async (options: {
  to: string; 
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}) => {
  try {
    // İlk kullanımda transporter oluştur
    if (!transporter) {
      transporter = await createTransporter();
    }
    
    const mailOptions = {
      from: smtpConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return { success: false, error };
  }
};

// Etkinlik kaydı onay e-postası gönder
export const sendEventRegistrationEmail = async (userEmail: string, eventDetails: {
  title: string;
  date: Date;
  location: string;
  userName: string;
}) => {
  const subject = `🎉 Etkinlik Kaydınız Onaylandı: ${eventDetails.title}`;
  
  // QR kod için etkinlik bilgilerini JSON formatında hazırla
  const eventData = JSON.stringify({
    title: eventDetails.title,
    date: eventDetails.date.toLocaleString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    location: eventDetails.location,
    attendee: eventDetails.userName,
    email: userEmail,
    confirmationId: `EVT-${Date.now().toString(36).toUpperCase()}`
  });
  
  // QR kodu Buffer olarak oluştur
  let qrCodeBuffer;
  try {
    qrCodeBuffer = await generateQRCodeBuffer(eventData);
  } catch (error) {
    console.error('QR kod oluşturulamadı:', error);
  }
  
  // Türkçe ay adlarını doğru formatla
  const eventDate = eventDetails.date.toLocaleString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // HTML e-posta şablonu
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f9f9f9;
        }
        .container {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 20px 15px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 25px;
          background: white;
        }
        .footer {
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #666;
          background-color: #f5f7fb;
          border-radius: 0 0 8px 8px;
        }
        .event-details {
          background-color: #f0f4ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .qr-section {
          text-align: center;
          margin: 25px 0;
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px dashed #93c5fd;
        }
        .qr-code {
          display: block;
          margin: 0 auto;
          max-width: 250px;
          border: 4px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .qr-caption {
          margin-top: 15px;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }
        .btn {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
          font-weight: 500;
          text-align: center;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-icon {
          display: inline-block;
          margin: 0 8px;
          font-size: 20px;
        }
        .highlight {
          color: #2563eb;
          font-weight: 600;
        }
        .divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 20px 0;
        }
        .alert-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 15px;
          margin: 15px 0;
          border-radius: 0 4px 4px 0;
          color: #92400e;
        }
        .emoji-big {
          font-size: 24px;
          margin-right: 5px;
        }
        .tag {
          display: inline-block;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 20px;
          margin-right: 5px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 Etkinlik Kaydınız Başarıyla Alındı!</h2>
        </div>
        <div class="content">
          <p>Merhaba <strong>${eventDetails.userName}</strong>, 👋</p>
          
          <p>Etkinliğimize kayıt olduğunuz için teşekkür ederiz! ✨ Kaydınız başarıyla tamamlanmıştır. Şimdiden heyecan verici bu etkinlikte sizi görmek için sabırsızlanıyoruz!</p>
          
          <div class="event-details">
            <h3>📅 ${eventDetails.title}</h3>
            <div>
              <span class="tag">Huawei Etkinliği</span>
              <span class="tag">Teknoloji</span>
              <span class="tag">Networking</span>
            </div>
            <p><strong>📆 Tarih:</strong> ${eventDate}</p>
            <p><strong>📍 Konum:</strong> ${eventDetails.location}</p>
            <p><strong>🎫 Durum:</strong> <span class="highlight">Onaylandı ✓</span></p>
          </div>
          
          <div class="qr-section">
            <div class="emoji-big">🎟️</div>
            <h3>Etkinlik Biletiniz</h3>
            <img src="cid:event-qr-code" alt="Etkinlik QR Kodu" class="qr-code">
            <p class="qr-caption">
              Bu QR kod, etkinliğe girişiniz için <strong>dijital biletinizdir</strong>. <br>
              E-posta ekinde de bulunmaktadır. İsterseniz yazdırabilir veya telefonunuzda gösterebilirsiniz. <br>
              <span class="highlight">Etkinlik girişinde bu QR kodu göstermeniz gerekecektir.</span>
            </p>
          </div>
          
          <div class="alert-box">
            <strong>📱 Hatırlatma:</strong> Etkinlik başlamadan önce size bir hatırlatma e-postası gönderilecektir. Etkinlik gününde zamanında gelmeyi unutmayın!
          </div>
          
          <p>Herhangi bir sorunuz veya özel isteğiniz varsa, lütfen bu e-postayı yanıtlayarak bizimle iletişime geçmekten çekinmeyin. Size yardımcı olmaktan memnuniyet duyarız. 🤝</p>
          
          <div class="divider"></div>
          
          <p>Etkinliğe katılmadan önce <span class="highlight">bilgilerinizi kontrol etmeyi unutmayın</span>. Değişiklik yapmak veya tüm etkinliklerinizi görmek için hesabınıza giriş yapabilirsiniz.</p>
          
          <div style="text-align: center;">
            <a href="https://hsdcommunities.com/dashboard" class="btn">📋 Etkinliklerim</a>
          </div>
        </div>
        <div class="footer">
          <p>Bu e-posta, etkinlik kaydınızı onaylamak için gönderilmiştir.</p>
          <div class="social-links">
            <span class="social-icon">📱</span>
            <span class="social-icon">💻</span>
            <span class="social-icon">📧</span>
          </div>
          <p>&copy; 2024 HSD Communities. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Düz metin alternatifi
  const textContent = `
    Merhaba ${eventDetails.userName},
    
    🎉 Etkinliğimize kayıt olduğunuz için teşekkür ederiz! Kaydınız başarıyla tamamlanmıştır.
    
    📅 Etkinlik: ${eventDetails.title}
    📆 Tarih: ${eventDate}
    📍 Konum: ${eventDetails.location}
    🎫 Durum: Onaylandı ✓
    
    🎟️ ETKİNLİK BİLETİNİZ
    Etkinlik QR kodunuz e-posta ekinde bulunmaktadır. Bu QR kod, etkinliğe girişiniz için dijital biletinizdir.
    Etkinlik girişinde bu QR kodu göstermeniz gerekecektir.
    
    📱 HATIRLATMA
    Etkinlik başlamadan önce size bir hatırlatma e-postası gönderilecektir. 
    Etkinlik gününde zamanında gelmeyi unutmayın!
    
    Herhangi bir sorunuz veya özel isteğiniz varsa, lütfen bu e-postayı yanıtlayarak bizimle iletişime geçmekten çekinmeyin.
    
    📋 Etkinliklerinizi görüntülemek için: https://hsdcommunities.com/dashboard
    
    HSD Communities
  `;
  
  // E-posta gönder (QR kodu ekli dosya olarak)
  return await sendMail({
    to: userEmail,
    subject,
    html: htmlContent,
    text: textContent,
    attachments: qrCodeBuffer ? [
      {
        filename: 'etkinlik-qr-kodu.png',
        content: qrCodeBuffer,
        cid: 'event-qr-code' // HTML içinde bu ID ile referans verilir
      }
    ] : undefined
  });
}; 