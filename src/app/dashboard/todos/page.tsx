import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TodoList from '@/components/dashboard/todos/TodoList';

export default function TodosPage() {
  return (
    <div>
      <DashboardHeader 
        title="Yapılacaklar" 
        description="Görevlerinizi ekleyin, tamamlayın ve yönetin."
      />
      
      <div className="mt-6">
        <TodoList />
      </div>
    </div>
  );
} 