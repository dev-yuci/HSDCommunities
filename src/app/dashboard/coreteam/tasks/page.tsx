'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { Task, TaskStatus, taskStatusLabels } from '@/types/task';
import { getAllTasks, deleteTask } from '@/services/taskService';
import TaskCard from '@/components/dashboard/tasks/TaskCard';
import TaskForm from '@/components/dashboard/tasks/TaskForm';
import CommentSection from '@/components/dashboard/tasks/CommentSection';
import { Skeleton } from '@/components/ui/Skeleton';

// Mock takım üyeleri - Gerçek uygulamada Firebase'den gelecek
const mockTeamMembers = [
  { id: '1', name: 'Ahmet Yılmaz' },
  { id: '2', name: 'Mehmet Kaya' },
  { id: '3', name: 'Ayşe Demir' },
  { id: '4', name: 'Fatma Şahin' },
  { id: '5', name: 'Ali Çelik' },
];

export default function TasksPage() {
  const { user, loading: authLoading } = useFirestoreAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskForComments, setTaskForComments] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);

  // Görevleri yükle
  useEffect(() => {
    if (!authLoading) {
      loadTasks();
    }
  }, [authLoading]);

  // Filtreler değiştiğinde görevleri filtrele
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === selectedFilter));
    }
  }, [selectedFilter, tasks]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      // Burada gerçek uygulamada takım üyelerini de Firebase'den alacağız
      // setTeamMembers(await getTeamMembers());
      
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
    } catch (error) {
      console.error('Görevler yüklenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Görev silinirken hata oluştu:', error);
    }
  };

  const handleViewComments = (task: Task) => {
    setTaskForComments(task);
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleFormSuccess = () => {
    loadTasks();
  };

  return (
    <div className="pb-10">
      <DashboardHeader 
        title="Görevler" 
        description="CoreTeam görevlerini oluşturun, düzenleyin ve takip edin"
      />
      
      <div className="mt-8">
        {/* Filtreler ve Yeni Görev Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Tümü
            </button>
            
            {Object.entries(taskStatusLabels).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status as TaskStatus)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedFilter === status
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleAddNewTask}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Yeni Görev
          </button>
        </div>
        
        {/* Görevler Listesi */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[300px] rounded-lg" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <svg
                className="h-10 w-10 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            
            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedFilter === 'all'
                ? 'Henüz görev bulunmuyor'
                : `${taskStatusLabels[selectedFilter]} durumunda görev bulunmuyor`}
            </h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400">
              {selectedFilter === 'all'
                ? 'Hemen yeni bir görev oluşturun ve takımınızla çalışmaya başlayın'
                : 'Başka bir durum filtresini deneyin veya yeni bir görev oluşturun'}
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddNewTask}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Yeni Görev Oluştur
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewComments={handleViewComments}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Görev Formu Modalı */}
      {showTaskForm && (
        <TaskForm
          initialTask={selectedTask || undefined}
          teamMembers={teamMembers}
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {/* Yorumlar Modalı */}
      {taskForComments && (
        <CommentSection
          task={taskForComments}
          teamMembers={teamMembers}
          onClose={() => setTaskForComments(null)}
        />
      )}
    </div>
  );
} 