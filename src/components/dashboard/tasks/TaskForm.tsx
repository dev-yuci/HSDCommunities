'use client';

import React, { useState, useEffect } from 'react';
import { Task, taskStatusLabels, priorityLabels } from '@/types/task';
import { createTask, updateTask } from '@/services/taskService';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';

interface TaskFormProps {
  initialTask?: Task;
  onClose: () => void;
  onSuccess: () => void;
  teamMembers: { id: string; name: string }[];
}

export default function TaskForm({ initialTask, onClose, onSuccess, teamMembers }: TaskFormProps) {
  const { user } = useFirestoreAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    assigneeId: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tags: ''
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  });

  // Düzenleme modu için form verilerini doldur
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        assigneeId: initialTask.assigneeId || '',
        dueDate: initialTask.dueDate ? initialTask.dueDate.toISOString().split('T')[0] : '',
        priority: initialTask.priority,
        tags: initialTask.tags ? initialTask.tags.join(', ') : ''
      });
    }
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Hata mesajını temizle
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: ''
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gerekli';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gerekli';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const assigneeName = formData.assigneeId
        ? teamMembers.find(member => member.id === formData.assigneeId)?.name || ''
        : '';

      if (initialTask) {
        // Güncelleme
        await updateTask(initialTask.id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          assigneeId: formData.assigneeId || undefined,
          assigneeName: assigneeName || undefined,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          priority: formData.priority,
          tags: tagsArray
        });
      } else {
        // Yeni görev oluşturma
        await createTask({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          assigneeId: formData.assigneeId || undefined,
          assigneeName: assigneeName || undefined,
          createdBy: user?.uid || 'unknown',
          createdByName: user?.displayName || 'Bilinmeyen Kullanıcı',
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          priority: formData.priority,
          tags: tagsArray
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Görev kaydedilirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  {initialTask ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'}
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {/* Başlık */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Başlık
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                      </div>

                      {/* Açıklama */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Açıklama
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                      </div>

                      {/* Durum */}
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Durum
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                        >
                          {Object.entries(taskStatusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Atanan Kişi */}
                      <div>
                        <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Atanan Kişi
                        </label>
                        <select
                          id="assigneeId"
                          name="assigneeId"
                          value={formData.assigneeId}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                        >
                          <option value="">Seçiniz</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bitiş Tarihi */}
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          id="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                        />
                      </div>

                      {/* Öncelik */}
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Öncelik
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
                        >
                          {Object.entries(priorityLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Etiketler */}
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Etiketler (virgülle ayırın)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          id="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          placeholder="tasarım, acil, toplantı"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 