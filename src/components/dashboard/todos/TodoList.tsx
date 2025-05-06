'use client';

import React, { useState, useEffect } from 'react';
import TodoItem, { Todo } from './TodoItem';
import { v4 as uuidv4 } from 'uuid';

// Kategori renkleri ve ikonları
const categoryColors = {
  'Genel': {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    icon: (
      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  'Etkinlik': {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
    icon: (
      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  'Toplantı': {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    icon: (
      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  'Proje': {
    bg: 'bg-amber-100 dark:bg-amber-900',
    text: 'text-amber-800 dark:text-amber-200',
    icon: (
      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  'Diğer': {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    icon: (
      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
};

// Rol bilgilerini RoleList'ten alabilmek için
interface Role {
  id: string;
  name: string;
  color: string;
}

// Örnek kişiler ve rolleri
const teamMembers = [
  { id: '1', name: 'Ahmet Yılmaz', role: 'Yönetici', avatar: '' },
  { id: '2', name: 'Zeynep Kaya', role: 'Moderatör', avatar: '' },
  { id: '3', name: 'Mehmet Demir', role: 'Kulüp Yöneticisi', avatar: '' },
  { id: '4', name: 'Ayşe Arslan', role: 'Üye', avatar: '' },
];

// Kategoriler
const categories = ['Genel', 'Etkinlik', 'Toplantı', 'Proje', 'Diğer'];

const initialTodos: Todo[] = [
  {
    id: '1',
    text: 'Etkinlik planını tamamla',
    completed: true,
    date: '10 Mayıs 2025',
    priority: 'medium',
    category: 'Etkinlik',
    dueDate: '2025-05-15',
    assignedTo: teamMembers[0],
    description: 'Etkinlik için mekan, tarih ve konuşmacıları belirle.',
    attachments: 2,
    comments: 5
  },
  {
    id: '2',
    text: 'Konuşmacılarla iletişime geç',
    completed: false,
    date: '15 Mayıs 2025',
    priority: 'high',
    category: 'Etkinlik',
    dueDate: '2025-05-20',
    assignedTo: teamMembers[1],
    comments: 3
  },
  {
    id: '3',
    text: 'Sosyal medya duyurularını hazırla',
    completed: false,
    date: '18 Mayıs 2025',
    priority: 'low',
    category: 'Genel',
    dueDate: '2025-05-25',
    description: 'Instagram, Twitter ve LinkedIn için görseller ve metinler hazırla.'
  },
  {
    id: '4',
    text: 'Haftalık toplantı hazırlığı',
    completed: false,
    date: '20 Mayıs 2025',
    priority: 'medium',
    category: 'Toplantı',
    dueDate: '2025-05-22',
    attachments: 1
  },
  {
    id: '5',
    text: 'Yeni proje teklifini incele',
    completed: false,
    date: '21 Mayıs 2025',
    priority: 'high',
    category: 'Proje',
    dueDate: '2025-05-28',
    assignedTo: teamMembers[2],
    description: 'Bütçe ve zaman planlamasını kontrol et, ekip üyelerini belirle.'
  }
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState<string>('Genel');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newAssignee, setNewAssignee] = useState<string>('');
  
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAdvancedFormOpen, setIsAdvancedFormOpen] = useState(false);

  const resetForm = () => {
    setNewTodo('');
    setNewPriority('medium');
    setNewCategory('Genel');
    setNewDueDate('');
    setNewAssignee('');
    setEditingTodo(null);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (editingTodo) {
      // Düzenleme işlemi
      const updatedTodo: Todo = {
        ...editingTodo,
        text: newTodo,
        priority: newPriority,
        category: newCategory,
        dueDate: newDueDate,
        assignedTo: newAssignee ? teamMembers.find(member => member.id === newAssignee) : undefined
      };

      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo))
      );
    } else {
      // Yeni görev ekleme
      const todo: Todo = {
        id: uuidv4(),
        text: newTodo,
        completed: false,
        date: formattedDate,
        priority: newPriority,
        category: newCategory,
        dueDate: newDueDate || undefined,
        assignedTo: newAssignee ? teamMembers.find(member => member.id === newAssignee) : undefined
      };

      setTodos([...todos, todo]);
    }

    resetForm();
    setIsAdvancedFormOpen(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
    setNewPriority(todo.priority);
    setNewCategory(todo.category || 'Genel');
    setNewDueDate(todo.dueDate || '');
    setNewAssignee(todo.assignedTo?.id || '');
    setIsAdvancedFormOpen(true);
  };

  const cancelEdit = () => {
    resetForm();
    setIsAdvancedFormOpen(false);
  };

  // Filtreleme işlemi
  const filteredTodos = todos.filter(todo => {
    // Durum filtresi
    const statusMatch = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && !todo.completed) || 
      (filterStatus === 'completed' && todo.completed);

    // Öncelik filtresi
    const priorityMatch = 
      filterPriority === 'all' || 
      todo.priority === filterPriority;
    
    // Atanan kişi filtresi
    const assigneeMatch = 
      filterAssignee === 'all' || 
      todo.assignedTo?.id === filterAssignee;
    
    // Kategori filtresi
    const categoryMatch = 
      filterCategory === 'all' || 
      todo.category === filterCategory;

    return statusMatch && priorityMatch && assigneeMatch && categoryMatch;
  }).sort((a, b) => {
    // Önceliğe göre sıralama
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* İlerleme çubuğu */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              İlerleme ({todos.filter(t => t.completed).length}/{todos.length})
            </span>
            <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
              {todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder={editingTodo ? "Görevi düzenle..." : "Yeni görev ekle..."}
                className="flex-1 py-2 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setIsAdvancedFormOpen(!isAdvancedFormOpen)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                title={isAdvancedFormOpen ? "Gelişmiş seçenekleri gizle" : "Gelişmiş seçenekler"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-lg transition-colors"
              >
                {editingTodo ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
            
            {isAdvancedFormOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Öncelik
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Son Tarih
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Görevli
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">Atanmamış</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>
                
                {editingTodo && (
                  <div className="col-span-full flex justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Filtreler */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durum
            </label>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-medium ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 text-xs font-medium ${
                  filterStatus === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 text-xs font-medium ${
                  filterStatus === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Tamamlanan
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Öncelik
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="w-full py-1.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-xs"
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full py-1.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-xs"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Görevli
            </label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full py-1.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-xs"
            >
              <option value="all">Herkes</option>
              <option value="">Atanmamış</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              categoryColors={categoryColors}
            />
          ))}
        </div>
        
        {filteredTodos.length === 0 && (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Görev bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {todos.length === 0 
                ? 'Henüz görev bulunmuyor. Yeni bir görev ekleyin.' 
                : 'Seçili filtrelere uygun görev bulunamadı.'}
            </p>
          </div>
        )}
        
        {todos.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <div>
              {`${todos.filter(t => t.completed).length} / ${todos.length} tamamlandı`}
            </div>
            {todos.filter(t => t.completed).length > 0 && (
              <button
                onClick={() => setTodos(todos.filter(t => !t.completed))}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Tamamlananları temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 