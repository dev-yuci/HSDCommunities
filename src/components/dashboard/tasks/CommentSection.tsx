'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskComment } from '@/types/task';
import { getTaskComments, addTaskComment, deleteTaskComment } from '@/services/taskService';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface CommentSectionProps {
  task: Task;
  teamMembers: { id: string; name: string }[];
  onClose: () => void;
}

export default function CommentSection({ task, teamMembers, onClose }: CommentSectionProps) {
  const { user } = useFirestoreAuthContext();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Yorumları yükle
  useEffect(() => {
    loadComments();
  }, [task.id]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getTaskComments(task.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    
    // Mention işlemleri için pozisyonu kaydet
    if (commentInputRef.current) {
      setCursorPosition(commentInputRef.current.selectionStart);
      
      // @ işareti yazıldığında mentions listesini göster
      const lastChar = e.target.value.charAt(commentInputRef.current.selectionStart - 1);
      const prevChar = e.target.value.charAt(commentInputRef.current.selectionStart - 2);
      
      if (lastChar === '@' && (prevChar === ' ' || prevChar === '' || prevChar === '\n')) {
        setShowMentions(true);
        setMentionFilter('');
      } else if (showMentions) {
        // @ işaretinden sonraki metni filtre olarak kullan
        const textBeforeCursor = e.target.value.substring(0, commentInputRef.current.selectionStart);
        const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
        
        if (lastAtSymbol !== -1) {
          const filterText = textBeforeCursor.substring(lastAtSymbol + 1);
          setMentionFilter(filterText);
        } else {
          setShowMentions(false);
        }
      }
    }
  };

  const insertMention = (memberName: string) => {
    if (commentInputRef.current) {
      const textBeforeCursor = newComment.substring(0, cursorPosition);
      const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtSymbol !== -1) {
        const textBeforeMention = newComment.substring(0, lastAtSymbol);
        const textAfterCursor = newComment.substring(cursorPosition);
        
        const newText = `${textBeforeMention}@${memberName} ${textAfterCursor}`;
        setNewComment(newText);
        
        // Cursor pozisyonunu ayarla
        const newCursorPosition = lastAtSymbol + memberName.length + 2; // @ + name + space
        setTimeout(() => {
          if (commentInputRef.current) {
            commentInputRef.current.focus();
            commentInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
    }
    
    setShowMentions(false);
  };

  // Yorumdaki @mentions'ları işle
  const processCommentText = (text: string): React.ReactNode[] => {
    const mentionPattern = /@(\w+)/g;
    const parts: React.ReactNode[] = [];
    
    let lastIndex = 0;
    let match;
    
    while ((match = mentionPattern.exec(text)) !== null) {
      // Eşleşmeden önceki metni ekle
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Eşleşmeyi (mention) ekle
      const mentionName = match[1];
      parts.push(
        <span key={`mention-${match.index}`} className="font-medium text-blue-600 dark:text-blue-400">
          @{mentionName}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Kalan metni ekle
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : [text];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // @mentions'ları analiz et
      const mentionPattern = /@(\w+)/g;
      const mentions: string[] = [];
      let match;
      
      while ((match = mentionPattern.exec(newComment)) !== null) {
        const mentionName = match[1];
        const mentionedMember = teamMembers.find(
          (member) => member.name.toLowerCase() === mentionName.toLowerCase()
        );
        
        if (mentionedMember) {
          mentions.push(mentionedMember.id);
        }
      }
      
      // Yeni yorumu ekle
      const comment: Omit<TaskComment, 'id' | 'createdAt'> = {
        content: newComment,
        authorId: user.uid,
        authorName: user.displayName || 'Bilinmeyen Kullanıcı',
        mentions: mentions.length > 0 ? mentions : undefined,
      };
      
      await addTaskComment(task.id, comment);
      
      // Yorumları yeniden yükle
      await loadComments();
      
      // Formu temizle
      setNewComment('');
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      await deleteTaskComment(task.id, commentId);
      // Yorumları yeniden yükle
      await loadComments();
    } catch (error) {
      console.error('Yorum silinirken hata oluştu:', error);
    }
  };

  const filteredTeamMembers = teamMembers.filter((member) =>
    mentionFilter === '' || member.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  "{task.title}" Görevi Yorumları
                </h3>
                
                <div className="mt-4">
                  {/* Yorumlar listesi */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
                    {isLoading ? (
                      <div className="text-center py-10">
                        <svg className="animate-spin mx-auto h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Yorumlar yükleniyor...</p>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Henüz yorum yapılmamış.</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                  {comment.authorName.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.authorName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(comment.createdAt, 'd MMM yyyy, HH:mm', { locale: tr })}
                                </p>
                              </div>
                            </div>
                            
                            {comment.authorId === user?.uid && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {processCommentText(comment.content)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Yorum ekleme formu */}
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="relative">
                      <textarea
                        ref={commentInputRef}
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Yorumunuzu yazın... @kullanıcı ile etiketleyebilirsiniz"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        rows={3}
                      ></textarea>
                      
                      {/* Mentions dropdown */}
                      {showMentions && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
                          {filteredTeamMembers.length > 0 ? (
                            filteredTeamMembers.map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => insertMention(member.name)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {member.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              Eşleşen kullanıcı bulunamadı
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !newComment.trim()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Gönderiliyor...
                            </>
                          ) : (
                            'Yorum Ekle'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 