'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestoreAuth } from '@/hooks/useFirestoreAuth';
import { CustomUser } from '@/lib/firestoreAuth';

// AuthContext türünü tanımla
type FirestoreAuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: CustomUser | null; error: any }>;
  logout: () => Promise<{ success: boolean; error: any }>;
  isAuthenticated: boolean;
  role: string;
};

// Context oluştur
const FirestoreAuthContext = createContext<FirestoreAuthContextType | undefined>(undefined);

// Provider bileşeni
export const FirestoreAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirestoreAuth();
  
  return <FirestoreAuthContext.Provider value={auth}>{children}</FirestoreAuthContext.Provider>;
};

// Kolay kullanım için custom hook
export const useFirestoreAuthContext = () => {
  const context = useContext(FirestoreAuthContext);
  
  if (context === undefined) {
    throw new Error('useFirestoreAuthContext must be used within an FirestoreAuthProvider');
  }
  
  return context;
}; 