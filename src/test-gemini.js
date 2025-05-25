// Gemini API test dosyası
// Bu dosya, Gemini API'nizin doğru çalışıp çalışmadığını test etmek için kullanılır
// Terminal'de çalıştırmak için: node src/test-gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// API anahtarı - gerçek projede .env dosyasından alınmalı
const apiKey = "AIzaSyBv__3o6eNMArs1xpkdYjchp7k5UG3HoxY";

// GoogleGenerativeAI örneği oluşturun
const genAI = new GoogleGenerativeAI(apiKey);

// Test edilecek model adları
const models = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
];

async function testGeminiModels() {
  console.log("Gemini API Modelleri Test Ediliyor...");
  console.log("-----------------------------------");
  
  for (const modelName of models) {
    try {
      console.log(`${modelName} modeli test ediliyor...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Merhaba, sen kimsin?");
      const text = result.response.text();
      
      console.log(`✅ ${modelName} başarılı!`);
      console.log(`Yanıt: ${text.substring(0, 100)}...`);
      console.log("-----------------------------------");
    } catch (error) {
      console.log(`❌ ${modelName} başarısız!`);
      console.log(`Hata: ${error.message}`);
      console.log("-----------------------------------");
    }
  }
}

// API'yi test et
testGeminiModels()
  .catch(error => {
    console.error("Test sırasında bir hata oluştu:", error);
  }); 