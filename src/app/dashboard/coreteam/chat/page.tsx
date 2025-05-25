'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { ChatMessage, sendMessage, editMessage, deleteMessage, subscribeToMessages } from '@/services/chatService';
import { Unsubscribe } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AiChatbot from '@/components/ai/AiChatbot';
import { getCoreTeamAssistantResponse, getSimpleGeminiResponse } from '@/services/aiService';

// Gemini ile soru yanıtlamayı belirten prefix
const GEMINI_PREFIX = '@gemini';

export default function CoreTeamChatPage() {
  const { user, loading, isAuthenticated } = useFirestoreAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAiChatbot, setShowAiChatbot] = useState(false);
  
  // Mesajları yükle ve dinle
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    let lastMessageCount = 0;
    
    if (!loading && user && isAuthenticated) {
      setLoadingMessages(true);
      
      unsubscribe = subscribeToMessages((newMessages) => {
        setMessages(newMessages);
        setLoadingMessages(false);
        
        // İlk yükleme sırasında otomatik olarak aşağı kaydır
        if (loadingMessages) {
          setTimeout(() => {
            scrollToBottom();
          }, 300);
          return;
        }
        
        // Yeni mesaj gelip gelmediğini kontrol et
        if (newMessages.length > lastMessageCount) {
          // Yeni mesaj geldi
          const newMessageCount = newMessages.length - lastMessageCount;
          lastMessageCount = newMessages.length;
          
          // Kullanıcı en alttaysa otomatik kaydır, değilse okunmamış mesaj sayısını artır
          if (isAtBottom) {
            setTimeout(() => {
              scrollToBottom('auto');
            }, 100);
          } else {
            // Okunmamış mesaj sayısını artır ama kendi mesajlarımızı saymayalım
            const newMessages = newMessageCount;
            if (newMessages > 0) {
              setUnreadCount(prev => prev + newMessages);
            }
          }
        } else {
          // Mesaj sayısı değişmedi veya azaldı (silme durumu)
          lastMessageCount = newMessages.length;
        }
      });
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, loading, isAtBottom, isAuthenticated]);
  
  // Kaydırma olayını dinle - debounce ile performansı iyileştir
  useEffect(() => {
    const handleScroll = () => {
      if (chatBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
        
        // Son 100px içindeyse "en altta" olarak kabul et
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
        
        if (isBottom !== isAtBottom) {
          setIsAtBottom(isBottom);
          
          if (isBottom && unreadCount > 0) {
            setUnreadCount(0);
          }
        }
      }
    };
    
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      // Scroll olayını debounce ile bağla - performans iyileştirmesi
      let scrollTimeout: NodeJS.Timeout;
      const debouncedHandleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      };
      
      chatBox.addEventListener('scroll', debouncedHandleScroll);
      
      return () => {
        if (chatBox) {
          chatBox.removeEventListener('scroll', debouncedHandleScroll);
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [unreadCount, isAtBottom]);
  
  // Gemini API üzerinden cevap alma
  const getGeminiResponse = async (question: string): Promise<string> => {
    try {
      setIsGeminiLoading(true);
      
      // @gemini prefix'ini kaldır
      const cleanQuestion = question.substring(GEMINI_PREFIX.length).trim();
      
      if (!cleanQuestion) {
        return "Lütfen Gemini'ye sormak istediğiniz bir soru belirtin.";
      }
      
      const response = await getSimpleGeminiResponse(cleanQuestion);
      
      if (response.success && response.message) {
        return response.message;
      } else {
        return `Üzgünüm, sorunuza yanıt verirken bir hata oluştu: ${response.error || 'Bilinmeyen hata'}`;
      }
    } catch (error) {
      console.error('Gemini yanıtı alınırken hata:', error);
      return 'Gemini API ile iletişim kurulurken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
    } finally {
      setIsGeminiLoading(false);
    }
  };
  
  // Gemini yanıtını sohbete ekle
  const sendGeminiResponse = async (question: string, responseText: string) => {
    if (!user) return;
    
    try {
      const botMessage = {
        userId: 'gemini-bot',
        userName: 'Gemini AI',
        userPhotoURL: '/default-thumbnail.jpg',
        content: responseText,
      };
      
      await sendMessage(botMessage);
      
      // Gemini yanıtı eklendiğinde otomatik olarak en aşağı kaydır
      setTimeout(() => {
        scrollToBottom('auto');
      }, 300);
    } catch (error) {
      console.error('Gemini yanıtı gönderilirken hata:', error);
      toast.error('Gemini yanıtı gönderilemedi');
    }
  };
  
  // Mesaj gönderme fonksiyonu
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || messageText.trim() === '' || isSending) return;
    
    if (editingMessageId) {
      // Mesaj düzenleme
      try {
        setIsSending(true);
        await editMessage(editingMessageId, messageText);
        setEditingMessageId(null);
        setMessageText('');
        toast.success('Mesaj başarıyla düzenlendi');
      } catch (error) {
        console.error('Mesaj düzenlenirken hata:', error);
        toast.error('Mesaj düzenlenirken bir hata oluştu');
      } finally {
        setIsSending(false);
      }
    } else {
      // Yeni mesaj gönderme
      try {
        setIsSending(true);
        const messageContent = messageText.trim();
        
        const newMessage = {
          userId: user.uid,
          userName: user.displayName || 'İsimsiz Kullanıcı',
          userPhotoURL: user.photoURL || null,
          content: messageContent,
        };
        
        await sendMessage(newMessage);
        setMessageText('');
        
        // Kendi mesajımızı gönderdikten sonra otomatik kaydır
        setIsAtBottom(true);
        scrollToBottom('auto');
        
        // @gemini ile başlayan mesajları işle
        if (messageContent.toLowerCase().startsWith(GEMINI_PREFIX.toLowerCase())) {
          const geminiResponse = await getGeminiResponse(messageContent);
          await sendGeminiResponse(messageContent, geminiResponse);
        }
      } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
        toast.error('Mesaj gönderilirken bir hata oluştu');
      } finally {
        setIsSending(false);
      }
    }
  };
  
  // Mesaj düzenleme
  const startEditingMessage = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setMessageText(message.content);
    // Input alanına odaklan
    const inputElement = document.getElementById('message-input');
    if (inputElement) {
      inputElement.focus();
    }
  };
  
  // Mesaj silme onay gösterme
  const confirmDeleteMessage = (messageId: string) => {
    setShowDeleteConfirm(messageId);
  };

  // Mesaj silme
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setShowDeleteConfirm(null);
      toast.success('Mesaj silindi');
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      toast.error('Mesaj silinirken bir hata oluştu');
    }
  };
  
  // Sayfanın en altına kaydır
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };
  
  // Yeni mesajlara git butonu
  const scrollToUnreadMessages = () => {
    scrollToBottom();
    setTimeout(() => {
      setIsAtBottom(true);
      setUnreadCount(0);
    }, 100);
  };
  
  // Tarih formatla
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Tarih formatla (gün dahil)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Gönderen kullanıcının kendisi olup olmadığını kontrol et
  const isCurrentUser = (userId: string) => {
    return user?.uid === userId;
  };
  
  // Mesajları tarih gruplarına ayır
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateKey = date.toLocaleDateString('tr-TR');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  // Mesaj Alanı işlemesi
  const renderMessageArea = () => {
    if (loadingMessages) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-medium">Henüz mesaj yok</p>
          <p className="text-sm mt-1">İlk mesajı siz gönderin!</p>
          <p className="text-sm mt-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded-lg">
            <strong>İpucu:</strong> @gemini ile başlayan mesajlar yapay zeka tarafından yanıtlanır.
          </p>
        </div>
      );
    }
    
    return (
      <div className="min-h-full flex flex-col justify-end">
        {Object.keys(messageGroups).map(dateKey => (
          <div key={dateKey} className="space-y-4 mb-6">
            <div className="flex justify-center">
              <div className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                {dateKey}
              </div>
            </div>
            
            <AnimatePresence>
              {messageGroups[dateKey].map((message) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser(message.userId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    isCurrentUser(message.userId) 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : message.userId === 'gemini-bot'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    } rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow`}
                  >
                    {!isCurrentUser(message.userId) && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400 overflow-hidden">
                          {message.userPhotoURL ? (
                            <img src={message.userPhotoURL} alt={message.userName} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-sm">{message.userName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="font-medium text-sm">
                          {message.userName}
                          {message.userId === 'gemini-bot' && 
                            <span className="ml-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                          }
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    
                    <div className={`text-xs mt-1 flex justify-between items-center ${
                      isCurrentUser(message.userId) 
                        ? 'text-blue-200' 
                        : message.userId === 'gemini-bot'
                          ? 'text-purple-200'
                          : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span>{formatTime(message.createdAt)}</span>
                      {message.isEdited && <span className="ml-2">(düzenlendi)</span>}
                    </div>
                    
                    {isCurrentUser(message.userId) && (
                      <div className={`flex mt-1 space-x-2 ${isCurrentUser(message.userId) ? 'justify-end' : 'justify-start'}`}>
                        <button
                          onClick={() => startEditingMessage(message)}
                          className="text-xs text-blue-200 hover:text-white transition-colors"
                        >
                          Düzenle
                        </button>
                        
                        {showDeleteConfirm === message.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded transition-colors"
                            >
                              Evet
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-0.5 rounded transition-colors"
                            >
                              İptal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => confirmDeleteMessage(message.id)}
                            className="text-xs text-blue-200 hover:text-white transition-colors"
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-1 scroll-mt-4" />
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 shadow-md rounded-b-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">CoreTeam Canlı Sohbet</h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm">
              Bu sohbet sadece CoreTeam üyeleri tarafından görülebilir. 
              <span className="ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                @gemini ile Gemini AI'ya soru sorabilirsiniz
              </span>
            </p>
          </div>
          <button 
            onClick={() => setShowAiChatbot(true)}
            className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-all"
            title="AI Asistanı"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0c1.085.082 2.162.082 3.25 0m-3.25 0a2.25 2.25 0 01-1.5-2.25V3.104m0 0a24.301 24.301 0 00-4.5 0" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mesaj Alanı */}
      <div 
        ref={chatBoxRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900 relative scroll-smooth"
        style={{ 
          height: 'calc(100vh - 160px)',
          scrollBehavior: 'smooth',
          overflowAnchor: 'auto' // Modern tarayıcılar için scroll davranışını iyileştirir
        }}
      >
        {renderMessageArea()}
        
        {/* Gemini yükleniyor göstergesi */}
        {isGeminiLoading && (
          <div className="fixed bottom-24 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Gemini düşünüyor...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Yeni mesajlara git butonu */}
      {unreadCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            onClick={scrollToUnreadMessages}
            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
            <span className="text-sm font-medium">{unreadCount} yeni mesaj</span>
          </button>
        </motion.div>
      )}
      
      {/* Mesaj Gönderme Formu */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-lg shadow-md">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            id="message-input"
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={editingMessageId 
              ? "Mesajı düzenle..." 
              : "Mesaj yaz... (@gemini ile Gemini AI'ya soru sorabilirsiniz)"}
            className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all"
            disabled={isSending || isGeminiLoading}
          />
          
          {editingMessageId && (
            <button
              type="button"
              onClick={() => {
                setEditingMessageId(null);
                setMessageText('');
              }}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full p-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSending || isGeminiLoading || messageText.trim() === ''}
            className={`text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md ${
              messageText.toLowerCase().startsWith(GEMINI_PREFIX.toLowerCase())
                ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isSending || isGeminiLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* AI Chatbot */}
      <AnimatePresence>
        {showAiChatbot && (
          <AiChatbot isOpen={showAiChatbot} onClose={() => setShowAiChatbot(false)} />
        )}
      </AnimatePresence>
    </div>
  );
} 