export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  mentions?: string[]; // @etiketlenen kullanıcı ID'leri
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string; // Görevin atandığı kişi
  assigneeName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  comments: TaskComment[];
  tags?: string[];
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  'todo': 'Yapılacak',
  'in-progress': 'Devam Ediyor',
  'completed': 'Tamamlandı'
};

export const taskStatusColors: Record<TaskStatus, string> = {
  'todo': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30',
  'completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
};

export const priorityLabels: Record<string, string> = {
  'low': 'Düşük',
  'medium': 'Orta',
  'high': 'Yüksek'
};

export const priorityColors: Record<string, string> = {
  'low': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800/30',
  'medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30',
  'high': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30'
}; 