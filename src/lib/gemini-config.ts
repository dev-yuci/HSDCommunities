import { GoogleGenerativeAI } from '@google/generative-ai';

// API anahtarı
export const apiKey = "AIzaSyBv__3o6eNMArs1xpkdYjchp7k5UG3HoxY";

// GoogleGenerativeAI örneği oluşturun
export const genAI = new GoogleGenerativeAI(apiKey);

// Chat modeli için yardımcı fonksiyon
export const getChatModel = () => {
  // Daha stabil bir model olan gemini-2.0-flash'ı kullanıyoruz
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// Hata durumunu kontrol eden yardımcı fonksiyon
export const isApiKeySet = () => {
  return !!apiKey;
}; 