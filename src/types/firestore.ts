export interface FirestoreEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  capacity: number;
  registered?: number;
  isRegistered?: boolean;
} 