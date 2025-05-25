// AI Chat Service Test Dosyası
// Bu dosya, AI Chat servisinin doğru çalışıp çalışmadığını test etmek için kullanılır
// Terminal'de çalıştırmak için: node src/test-ai-chat.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// API anahtarı
const apiKey = "AIzaSyBv__3o6eNMArs1xpkdYjchp7k5UG3HoxY";

// GoogleGenerativeAI örneği oluşturun
const genAI = new GoogleGenerativeAI(apiKey);

// Chat modeli için yardımcı fonksiyon
const getChatModel = () => {
  // Daha stabil bir model olan gemini-2.0-flash'ı kullanıyoruz
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// Test mesajı
const testMessage = {
  role: 'user',
  content: 'Merhaba, bana Huawei hakkında kısa bir bilgi verir misin?'
};

async function testAiChat() {
  console.log("AI Chat Servisi Test Ediliyor...");
  console.log("-----------------------------------");
  
  try {
    // Chat modelini al
    const model = getChatModel();
    console.log("✅ Chat modeli alındı");
    
    // Test mesajını gönder
    console.log("Test mesajı gönderiliyor...");
    const result = await model.generateContent(testMessage.content);
    const text = result.response.text();
    
    console.log("✅ Yanıt başarıyla alındı");
    console.log("\nYanıt:");
    console.log("-----------------------------------");
    console.log(text);
    console.log("-----------------------------------");
  } catch (error) {
    console.error("❌ Test sırasında bir hata oluştu:", error.message);
  }
}

// Testi çalıştır
testAiChat()
  .catch(error => {
    console.error("Genel hata:", error);
  }); 