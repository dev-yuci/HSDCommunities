import { getChatModel, isApiKeySet } from '@/lib/gemini-config';

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
  timestamp?: number; // Mesaj zamanı
  id?: string; // Benzersiz mesaj kimliği
}

export interface ChatSession {
  id: string; // Oturum kimliği
  name: string; // Oturum adı
  messages: ChatMessage[]; // Oturumdaki mesajlar
  createdAt: number; // Oluşturulma zamanı
  updatedAt: number; // Son güncelleme zamanı
}

export interface AiResponse {
  success: boolean;
  message?: string;
  error?: string;
  sessionId?: string; // Yanıtın ait olduğu oturumun kimliği
}

// Kota hatası kontrolü
const isQuotaError = (error: any): boolean => {
  return error?.message?.includes('quota') || 
         error?.message?.includes('429') || 
         error?.message?.includes('rate limit');
};

// Model hatası kontrolü
const isModelError = (error: any): boolean => {
  return error?.message?.includes('not found') || 
         error?.message?.includes('404') || 
         error?.message?.includes('models/gemini') ||
         error?.message?.includes('is not supported') ||
         error?.message?.includes('Call ListModels');
};

// Önceden hazırlanmış yanıtlar
const FALLBACK_RESPONSES = [
  "Merhaba! Ben CoreTeam asistanıyım. Şu anda teknik bir sorun yaşıyoruz. Size daha sonra yardımcı olabilir miyim?",
  "Size yardımcı olmak isterdim, ancak şu anda API servisine bağlanamıyorum. Lütfen daha sonra tekrar deneyin.",
  "Özür dilerim, API modelinde bir sorun oluştu. Ekibimiz bu konuda çalışıyor.",
  "Üzgünüm, şu anda yanıt veremiyorum. Teknik bir sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin."
];

// Rastgele hazır yanıt döndür
const getRandomFallbackResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[randomIndex];
};

// Benzersiz kimlik oluştur
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mesaj geçmişini localStorage'dan al
export const getChatSessions = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const sessionsJson = localStorage.getItem('chat_sessions');
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error('Sohbet oturumları alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir sohbet oturumunu al
export const getChatSession = (sessionId: string): ChatSession | undefined => {
  const sessions = getChatSessions();
  return sessions.find(s => s.id === sessionId);
};

// Sohbet oturumunu kaydet
export const saveChatSession = (session: ChatSession): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getChatSessions();
    const existingSessionIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingSessionIndex >= 0) {
      sessions[existingSessionIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Sohbet oturumu kaydedilirken hata oluştu:', error);
  }
};

// Yeni bir sohbet oturumu oluştur
export const createChatSession = (name: string = 'Yeni Sohbet'): ChatSession => {
  const now = Date.now();
  const session: ChatSession = {
    id: generateId(),
    name,
    messages: [],
    createdAt: now,
    updatedAt: now
  };
  
  saveChatSession(session);
  return session;
};

// Sohbet oturumuna mesaj ekle
export const addMessageToChatSession = (
  sessionId: string, 
  message: ChatMessage
): ChatSession | undefined => {
  const session = getChatSession(sessionId);
  
  if (!session) return undefined;
  
  // Mesaja kimlik ve zaman damgası ekle
  const updatedMessage = {
    ...message,
    id: message.id || generateId(),
    timestamp: message.timestamp || Date.now()
  };
  
  // Oturumu güncelle
  const updatedSession = {
    ...session,
    messages: [...session.messages, updatedMessage],
    updatedAt: Date.now()
  };
  
  saveChatSession(updatedSession);
  return updatedSession;
};

// Gemini API'si ile sohbet etmek için kullanılan fonksiyon
export const chatWithAi = async (
  messages: ChatMessage[], 
  sessionId?: string
): Promise<AiResponse> => {
  // Mevcut veya yeni bir oturum kimliği al
  const currentSessionId = sessionId || generateId();
  
  try {
    // API anahtarının ayarlanıp ayarlanmadığını kontrol edin
    if (!isApiKeySet()) {
      return {
        success: false,
        error: 'Gemini API anahtarı ayarlanmamış. Lütfen .env dosyasında NEXT_PUBLIC_GEMINI_API_KEY değişkenini ayarlayın.',
        sessionId: currentSessionId
      };
    }

    // Chat modelini alın
    const model = getChatModel();
    
    try {
      // Geçmiş mesajları formatla (son 10 mesaj)
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      }));

      // API istediği gönder
      const result = await model.generateContent({
        contents: recentMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const response = result.response;
      const text = response.text();
      
      // Yanıtı oturuma ekle
      if (sessionId) {
        const userMessage = messages[messages.length - 1];
        addMessageToChatSession(sessionId, userMessage);
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: text,
          timestamp: Date.now(),
          id: generateId()
        };
        
        addMessageToChatSession(sessionId, assistantMessage);
      }

      return {
        success: true,
        message: text,
        sessionId: currentSessionId
      };
    } catch (modelError: any) {
      console.error('Model ile iletişim hatası:', modelError);
      
      // Kota hatası mı kontrol et
      if (isQuotaError(modelError)) {
        console.log('API kota sınırı aşıldı, hazır yanıt kullanılıyor');
        const fallbackResponse = getRandomFallbackResponse();
        
        if (sessionId) {
          const userMessage = messages[messages.length - 1];
          addMessageToChatSession(sessionId, userMessage);
          
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: fallbackResponse,
            timestamp: Date.now(),
            id: generateId()
          };
          
          addMessageToChatSession(sessionId, assistantMessage);
        }
        
        return {
          success: true,
          message: fallbackResponse,
          sessionId: currentSessionId
        };
      }
      
      // Model hatası mı kontrol et
      if (isModelError(modelError)) {
        console.log('Model hatası oluştu, hazır yanıt kullanılıyor');
        const fallbackResponse = getRandomFallbackResponse();
        
        if (sessionId) {
          const userMessage = messages[messages.length - 1];
          addMessageToChatSession(sessionId, userMessage);
          
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: fallbackResponse,
            timestamp: Date.now(),
            id: generateId()
          };
          
          addMessageToChatSession(sessionId, assistantMessage);
        }
        
        return {
          success: true,
          message: fallbackResponse,
          sessionId: currentSessionId
        };
      }
      
      throw modelError; // Diğer hata durumlarında hatayı yukarı ilet
    }
  } catch (error: any) {
    console.error('AI ile sohbet ederken hata oluştu:', error);
    
    // Kota hatası veya model hatası için hazır yanıt
    if (isQuotaError(error) || isModelError(error)) {
      const fallbackResponse = getRandomFallbackResponse();
      
      if (sessionId) {
        const userMessage = messages[messages.length - 1];
        addMessageToChatSession(sessionId, userMessage);
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: fallbackResponse,
          timestamp: Date.now(),
          id: generateId()
        };
        
        addMessageToChatSession(sessionId, assistantMessage);
      }
      
      return {
        success: true,
        message: fallbackResponse,
        sessionId: currentSessionId
      };
    }
    
    return {
      success: false,
      error: `API Hatası: ${error.message || 'Bilinmeyen bir hata oluştu.'}`,
      sessionId: currentSessionId
    };
  }
};

// CoreTeam için AI asistanı
export const getCoreTeamAssistantResponse = async (
  userMessage: string,
  sessionId?: string
): Promise<AiResponse> => {
  // Eğer bir oturum kimliği yoksa yeni bir oturum oluştur
  let currentSessionId = sessionId;
  let messages: ChatMessage[] = [];
  
  if (sessionId) {
    // Mevcut oturumu al
    const session = getChatSession(sessionId);
    if (session) {
      messages = [...session.messages];
    }
  } else {
    // Yeni bir oturum oluştur
    const session = createChatSession(`Sohbet - ${new Date().toLocaleString('tr-TR')}`);
    currentSessionId = session.id;
  }
  
  // Kullanıcı mesajını hazırla
  const userChatMessage: ChatMessage = {
    role: 'user',
    content: `Sen CoreTeam asistanısın. Kullanıcılara yardımcı olmak için buradasın. ${userMessage}`
  };
  
  // Tüm mesajları birleştir
  const allMessages = [...messages, userChatMessage];
  
  // AI ile sohbet et
  const response = await chatWithAi(allMessages, currentSessionId);
  
  // Eğer mesaj yoksa bir varsayılan mesaj ekliyoruz
  if (response.success && !response.message) {
    response.message = "Üzgünüm, bir yanıt oluşturamadım. Lütfen tekrar deneyin.";
    
    if (currentSessionId) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        id: generateId()
      };
      
      addMessageToChatSession(currentSessionId, assistantMessage);
    }
  }
  
  return response;
};

// CoreTeam sohbet için düz metin yanıt alacak basit asistan
export const getSimpleGeminiResponse = async (userMessage: string): Promise<AiResponse> => {
  try {
    // API anahtarının ayarlanıp ayarlanmadığını kontrol edin
    if (!isApiKeySet()) {
      return {
        success: false,
        error: 'Gemini API anahtarı ayarlanmamış. Lütfen .env dosyasında NEXT_PUBLIC_GEMINI_API_KEY değişkenini ayarlayın.'
      };
    }

    // Chat modelini alın
    const model = getChatModel();
    
    try {
      // Basit içerik oluşturma (oturum ve mesaj geçmişi olmadan)
      const result = await model.generateContent(userMessage);
      const response = result.response;
      const text = response.text();
      
      return {
        success: true,
        message: text
      };
    } catch (modelError: any) {
      console.error('Model ile iletişim hatası:', modelError);
      
      // Kota hatası mı kontrol et
      if (isQuotaError(modelError)) {
        console.log('API kota sınırı aşıldı, hazır yanıt kullanılıyor');
        return {
          success: true,
          message: getRandomFallbackResponse()
        };
      }
      
      // Model hatası mı kontrol et
      if (isModelError(modelError)) {
        console.log('Model hatası oluştu, hazır yanıt kullanılıyor');
        return {
          success: true,
          message: getRandomFallbackResponse()
        };
      }
      
      throw modelError; // Diğer hata durumlarında hatayı yukarı ilet
    }
  } catch (error: any) {
    console.error('AI ile sohbet ederken hata oluştu:', error);
    
    // Kota hatası veya model hatası için hazır yanıt
    if (isQuotaError(error) || isModelError(error)) {
      return {
        success: true,
        message: getRandomFallbackResponse()
      };
    }
    
    return {
      success: false,
      error: `API Hatası: ${error.message || 'Bilinmeyen bir hata oluştu.'}`
    };
  }
}; 