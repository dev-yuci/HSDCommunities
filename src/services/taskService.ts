import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Task, TaskComment, TaskStatus } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'tasks';
const COMMENTS_COLLECTION_NAME = 'taskComments';

// Firestore'dan gelen verileri uygun formata dönüştürme
const convertTaskFromFirestore = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    status: data.status,
    assigneeId: data.assigneeId,
    assigneeName: data.assigneeName,
    createdBy: data.createdBy,
    createdByName: data.createdByName,
    createdAt: data.createdAt?.toDate() || new Date(),
    dueDate: data.dueDate?.toDate(),
    priority: data.priority || 'medium',
    comments: data.comments || [],
    tags: data.tags || []
  };
};

// Tüm görevleri getir
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertTaskFromFirestore);
  } catch (error) {
    console.error('Görevler getirilirken hata oluştu:', error);
    throw error;
  }
};

// Belirli bir duruma göre görevleri getir
export const getTasksByStatus = async (status: TaskStatus): Promise<Task[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertTaskFromFirestore);
  } catch (error) {
    console.error(`${status} durumundaki görevler getirilirken hata oluştu:`, error);
    throw error;
  }
};

// Belirli bir kullanıcıya atanmış görevleri getir
export const getTasksByAssignee = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('assigneeId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertTaskFromFirestore);
  } catch (error) {
    console.error(`Kullanıcıya atanmış görevler getirilirken hata oluştu:`, error);
    throw error;
  }
};

// Yeni görev oluştur
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'comments'>): Promise<Task> => {
  try {
    const newTask = {
      ...taskData,
      createdAt: serverTimestamp(),
      comments: []
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newTask);
    
    return {
      id: docRef.id,
      ...taskData,
      createdAt: new Date(),
      comments: []
    };
  } catch (error) {
    console.error('Görev oluşturulurken hata oluştu:', error);
    throw error;
  }
};

// Görev durumunu güncelle
export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<void> => {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await updateDoc(taskRef, { status });
  } catch (error) {
    console.error('Görev durumu güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Görevi güncelle
export const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'comments'>>): Promise<void> => {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error('Görev güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Görevi sil
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Görev silinirken hata oluştu:', error);
    throw error;
  }
};

// Yorumları getir
export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME, taskId, COMMENTS_COLLECTION_NAME),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: data.createdAt?.toDate() || new Date(),
        mentions: data.mentions || []
      };
    });
  } catch (error) {
    console.error('Görev yorumları getirilirken hata oluştu:', error);
    throw error;
  }
};

// Yorum ekle
export const addTaskComment = async (
  taskId: string, 
  comment: Omit<TaskComment, 'id' | 'createdAt'>
): Promise<TaskComment> => {
  try {
    const newComment = {
      ...comment,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(
      collection(db, COLLECTION_NAME, taskId, COMMENTS_COLLECTION_NAME),
      newComment
    );
    
    return {
      id: docRef.id,
      ...comment,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Görev yorumu eklenirken hata oluştu:', error);
    throw error;
  }
};

// Yorumu sil
export const deleteTaskComment = async (taskId: string, commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, COLLECTION_NAME, taskId, COMMENTS_COLLECTION_NAME, commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error('Görev yorumu silinirken hata oluştu:', error);
    throw error;
  }
}; 