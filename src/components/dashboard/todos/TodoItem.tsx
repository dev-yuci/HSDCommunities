'use client';

import React from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  category?: string;
  description?: string;
  attachments?: number;
  comments?: number;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  categoryColors: Record<string, { bg: string, text: string, icon: React.ReactNode }>;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, categoryColors }: TodoItemProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const priorityLabels = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
  };

  // Kalan gün hesaplama
  const getDaysRemaining = () => {
    if (!todo.dueDate) return null;
    
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  
  const categoryColor = todo.category && categoryColors[todo.category] 
    ? categoryColors[todo.category] 
    : { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', icon: null };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow transition-all duration-200 overflow-hidden border-l-4 ${
      todo.completed 
        ? 'border-gray-300 dark:border-gray-600 opacity-75' 
        : priorityMap[todo.priority]
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <button
              onClick={() => onToggle(todo.id)}
              className={`flex-shrink-0 h-5 w-5 mt-1 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                todo.completed
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              } flex items-center justify-center`}
              aria-label={todo.completed ? "Tamamlandı olarak işaretle" : "Tamamlanmadı olarak işaretle"}
            >
              {todo.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={`text-base font-medium ${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-200'
                  }`}
                >
                  {todo.text}
                </p>
                
                {/* Kategori etiketi */}
                {todo.category && (
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${categoryColor.bg} ${categoryColor.text}`}>
                    {categoryColor.icon}
                    <span>{todo.category}</span>
                  </div>
                )}
                
                {/* Öncelik etiketi */}
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                  {priorityLabels[todo.priority]}
                </span>
              </div>
              
              {/* Opsiyonel açıklama */}
              {todo.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {todo.description}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {/* Tarih bilgileri */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="mr-1 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Oluşturuldu: {todo.date}
                  </div>
                  
                  {todo.dueDate && (
                    <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      <svg className="mr-1 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {isOverdue ? 'Gecikmiş!' : 'Son tarih:'} {new Date(todo.dueDate).toLocaleDateString('tr-TR')}
                      {daysRemaining !== null && daysRemaining >= 0 && ` (${daysRemaining} gün kaldı)`}
                    </div>
                  )}
                </div>
                
                {/* İçerik bilgileri */}
                <div className="flex items-center gap-3">
                  {todo.attachments !== undefined && todo.attachments > 0 && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="mr-1 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {todo.attachments}
                    </div>
                  )}
                  
                  {todo.comments !== undefined && todo.comments > 0 && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="mr-1 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {todo.comments}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            {onEdit && (
              <button
                onClick={() => onEdit(todo)}
                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                title="Düzenle"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
              title="Sil"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
        
        {/* Görevli kişi bilgisi */}
        {todo.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {todo.assignedTo.avatar ? (
                  <img src={todo.assignedTo.avatar} alt={todo.assignedTo.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-xs font-medium">
                    {todo.assignedTo.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-2 text-xs">
                <span className="text-gray-600 dark:text-gray-300">{todo.assignedTo.name}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">({todo.assignedTo.role})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Önceliğe göre sol kenar çizgi renkleri
const priorityMap = {
  high: 'border-red-500 dark:border-red-400',
  medium: 'border-yellow-500 dark:border-yellow-400',
  low: 'border-green-500 dark:border-green-400'
}; 