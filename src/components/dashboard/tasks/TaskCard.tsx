'use client';

import React, { useState } from 'react';
import { Task, taskStatusLabels, taskStatusColors, priorityLabels, priorityColors } from '@/types/task';
import { updateTaskStatus } from '@/services/taskService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewComments: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onViewComments }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'todo' | 'in-progress' | 'completed') => {
    try {
      setIsUpdating(true);
      await updateTaskStatus(task.id, newStatus);
      // Status değişikliği bildirilecek, ancak sayfa yeniden yükleneceği için
      // herhangi bir state güncellemesi yapmıyoruz
    } catch (error) {
      console.error('Durum güncellenirken hata oluştu:', error);
    } finally {
      setIsUpdating(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
      {/* Başlık ve Durum */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${taskStatusColors[task.status]}`}>
            {taskStatusLabels[task.status]}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => onEdit(task)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => onViewComments(task)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  Yorumlar
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  Sil
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Durumu Değiştir
                </div>
                <button
                  onClick={() => handleStatusChange('todo')}
                  disabled={task.status === 'todo' || isUpdating}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    task.status === 'todo'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 cursor-default'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  Yapılacak
                </button>
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={task.status === 'in-progress' || isUpdating}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    task.status === 'in-progress'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 cursor-default'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  Devam Ediyor
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={task.status === 'completed' || isUpdating}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    task.status === 'completed'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-default'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  Tamamlandı
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Görev İçeriği */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{task.description}</p>
        
        {/* Atanan Kişi ve Tarih */}
        <div className="flex flex-col space-y-2 text-xs text-gray-500 dark:text-gray-400">
          {task.assigneeName && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{task.assigneeName}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {format(task.dueDate, 'd MMMM yyyy', { locale: tr })}
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span>{task.comments.length} yorum</span>
          </div>
        </div>
      </div>
      
      {/* Alt Bölüm - Oluşturan ve Oluşturma Tarihi */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{task.createdByName}</span>
          </div>
          <span>{format(task.createdAt, 'd MMM yyyy', { locale: tr })}</span>
        </div>
      </div>
    </div>
  );
} 