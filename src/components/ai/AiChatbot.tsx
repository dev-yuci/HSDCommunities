'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { getCoreTeamAssistantResponse, ChatMessage, ChatSession, getChatSessions, getChatSession, createChatSession } from '@/services/aiService';

// HSD Communities bilgileri - Bilgi tabanı olarak kullanılacak
const HSD_INFO = `
# Huawei Student Developers Türkiye Hakkında

HSD (Huawei Student Developers) Türkiye'nin farklı üniversitelerinde aktif olarak çalışan bir öğrenci geliştirici topluluğudur.

## Ana Amaçlar
- Öğrencilere teknoloji alanında eğitimler sunmak
- Yazılım geliştirme becerilerini artırmak
- Huawei teknolojileri hakkında bilgilendirmek
- Networking imkanları sağlamak

## Etkinlikler
- Yazılım ve teknoloji atölyeleri
- Hackathon'lar
- Konferanslar ve seminerler
- Networking buluşmaları
- Kariyer günleri

## Topluluk Kuralları
1. Saygılı ve kapsayıcı bir ortam oluşturma
2. Aktif katılımın teşvik edilmesi
3. Bilgi ve deneyim paylaşımı
4. İşbirliğinin desteklenmesi

## İletişim
- Instagram: @hsdturkey
- Twitter: @HSDTurkey
- LinkedIn: Huawei Student Developers Türkiye
- Email: hsd@huawei.com

Daha fazla bilgi için web sitemizi ziyaret edebilirsiniz.
`;

// Bot bilgilerini tanımlayın
const BOT_INFO = {
  name: 'CoreTeam Asistanı',
  description: 'HSD Communities hakkında bilgi almak için benimle sohbet edebilirsiniz.',
  avatar: '/default-thumbnail.jpg',
};

// Görsel yüklenememe durumu için işlev
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.onerror = null; // Sonsuz döngüyü önle
  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1lc3NhZ2UtY2lyY2xlIj48cGF0aCBkPSJNNy45IDIwSDZhMiAyIDAgMCAxLTItMlY2YTIgMiAwIDAgMSAyLTJoMTJhMiAyIDAgMCAxIDIgMnYxMGEyIDIgMCAwIDEtMiAyaC03LjlsLTQgNFoiLz48L3N2Zz4='; // Basit bir sohbet ikonu
};

interface AiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ isOpen, onClose }) => {
  // State tanımlamaları
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'info' | 'knowledge'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sohbet oturumlarını yükle
  useEffect(() => {
    const loadedSessions = getChatSessions();
    setSessions(loadedSessions);
    
    // Aktif bir oturum yoksa ve yüklenmiş oturumlar varsa, en son oturumu aktif et
    if (!activeSession && loadedSessions.length > 0) {
      const mostRecent = loadedSessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];
      setActiveSession(mostRecent);
    } else if (!activeSession && loadedSessions.length === 0) {
      // Hiç oturum yoksa yeni bir tane oluştur
      const newSession = createChatSession();
      setSessions([newSession]);
      setActiveSession(newSession);
    }
  }, []);
  
  // Mesajlara scroll yap
  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Soru gönderme işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!activeSession) {
        // Aktif oturum yoksa yeni bir tane oluştur
        const newSession = createChatSession();
        setActiveSession(newSession);
        setSessions(prev => [...prev, newSession]);
        
        const response = await getCoreTeamAssistantResponse(question, newSession.id);
        
        if (response.success && response.sessionId) {
          // Oturumu güncelle
          const updatedSession = getChatSession(response.sessionId);
          if (updatedSession) {
            setActiveSession(updatedSession);
            setSessions(getChatSessions());
          }
        } else if (!response.success) {
          console.error('API hatası:', response.error);
        }
      } else {
        // Mevcut oturumu kullan
        const response = await getCoreTeamAssistantResponse(question, activeSession.id);
        
        if (response.success) {
          // Oturumu güncelle
          const updatedSession = getChatSession(activeSession.id);
          if (updatedSession) {
            setActiveSession(updatedSession);
            setSessions(getChatSessions());
          }
        } else {
          console.error('API hatası:', response.error);
        }
      }
    } catch (error) {
      console.error('Sohbet hatası:', error);
      if (String(error).includes('quota')) {
        setIsQuotaExceeded(true);
      }
    } finally {
      setQuestion('');
      setIsLoading(false);
    }
  };
  
  // Yeni sohbet oluştur
  const handleNewChat = () => {
    const newSession = createChatSession();
    setActiveSession(newSession);
    setSessions(prev => [...prev, newSession]);
    setActiveTab('chat');
  };
  
  // Sohbeti değiştir
  const handleChangeSession = (sessionId: string) => {
    const session = getChatSession(sessionId);
    if (session) {
      setActiveSession(session);
      setActiveTab('chat');
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-full sm:w-96 md:w-[450px] h-[550px] md:h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden">
      {/* Başlık */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-500 text-white">
        <h2 className="flex items-center font-semibold">
          <span className="flex items-center justify-center w-5 h-5 bg-white text-blue-500 rounded-sm font-bold mr-2 text-xs">🚩</span>
          {BOT_INFO.name}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
            onClick={handleNewChat}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <button 
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Sekme Başlıkları */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'chat' 
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          Sohbet
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'knowledge' 
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('knowledge')}
        >
          Bilgi Tabanı
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'info' 
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('info')}
        >
          Geçmiş
        </button>
      </div>
      
      {/* Sohbet İçeriği */}
      {activeTab === 'chat' && (
        <>
          <div className="flex-1 p-4 overflow-y-auto">
            {activeSession?.messages && activeSession.messages.length > 0 ? (
              <div className="space-y-4">
                {activeSession.messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.timestamp && (
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="text-center mb-4">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1lc3NhZ2UtY2lyY2xlIj48cGF0aCBkPSJNNy45IDIwSDZhMiAyIDAgMCAxLTItMlY2YTIgMiAwIDAgMSAyLTJoMTJhMiAyIDAgMCAxIDIgMnYxMGEyIDIgMCAwIDEtMiAyaC03LjlsLTQgNFoiLz48L3N2Zz4=" 
                    alt="Logo" 
                    className="w-20 h-20 mx-auto text-blue-500"
                    style={{ filter: 'invert(45%) sepia(90%) saturate(2000%) hue-rotate(200deg) brightness(100%) contrast(95%)' }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{BOT_INFO.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{BOT_INFO.description}</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('knowledge')}
                    className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 rounded-md"
                  >
                    Bilgi Tabanı
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('info')}
                    className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 rounded-md"
                  >
                    Geçmiş Sohbetler
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Giriş Alanı */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isQuotaExceeded && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-2 mb-3 text-xs text-yellow-800 dark:text-yellow-300">
                <p className="font-medium">API kota sınırı aşıldı</p>
                <p>Şu anda Gemini API'nin ücretsiz kota sınırına ulaşıldı. Sohbet sınırlı yanıtlar verebilir. Lütfen daha sonra tekrar deneyin.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col space-y-2">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Sorunuzu buraya yazın..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows={1}
                  disabled={isLoading}
                />
                
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Yanıt alınıyor...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Gönder</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      
      {/* Bilgi Tabanı İçeriği */}
      {activeTab === 'knowledge' && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h1>Huawei Student Developers Türkiye Hakkında</h1>
            <p>HSD (Huawei Student Developers) Türkiye'nin farklı üniversitelerinde aktif olarak çalışan bir öğrenci geliştirici topluluğudur.</p>
            
            <h2>Ana Amaçlar</h2>
            <ul>
              <li>Öğrencilere teknoloji alanında eğitimler sunmak</li>
              <li>Yazılım geliştirme becerilerini artırmak</li>
              <li>Huawei teknolojileri hakkında bilgilendirmek</li>
              <li>Networking imkanları sağlamak</li>
            </ul>
            
            <h2>Etkinlikler</h2>
            <ul>
              <li>Yazılım ve teknoloji atölyeleri</li>
              <li>Hackathon'lar</li>
              <li>Konferanslar ve seminerler</li>
              <li>Networking buluşmaları</li>
              <li>Kariyer günleri</li>
            </ul>
            
            <h2>Topluluk Kuralları</h2>
            <ol>
              <li>Saygılı ve kapsayıcı bir ortam oluşturma</li>
              <li>Aktif katılımın teşvik edilmesi</li>
              <li>Bilgi ve deneyim paylaşımı</li>
              <li>İşbirliğinin desteklenmesi</li>
            </ol>
            
            <h2>İletişim</h2>
            <ul>
              <li>Instagram: @hsdturkey</li>
              <li>Twitter: @HSDTurkey</li>
              <li>LinkedIn: Huawei Student Developers Türkiye</li>
              <li>Email: hsd@huawei.com</li>
            </ul>
            
            <p>Daha fazla bilgi için web sitemizi ziyaret edebilirsiniz.</p>
          </div>
        </div>
      )}
      
      {/* Geçmiş Sohbetler */}
      {activeTab === 'info' && (
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Sohbet Geçmişi</h3>
          
          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    activeSession?.id === session.id 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handleChangeSession(session.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <polyline points="23 20 23 14 17 14"></polyline>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                      <span className="font-medium truncate">{session.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.updatedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {session.messages.length > 0 
                      ? session.messages[session.messages.length - 1].content.substring(0, 60) + '...' 
                      : 'Henüz mesaj yok'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-gray-500 dark:text-gray-400">Henüz sohbet geçmişi yok</p>
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleNewChat}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Yeni Sohbet Başlat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot; 