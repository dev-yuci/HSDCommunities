'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

// AuthContext türünü tanımla
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  loginGoogle: () => Promise<{ user: User | null; error: any }>;
  logout: () => Promise<{ success: boolean; error: any }>;
  isAuthenticated: boolean;
};

// Context oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Kolay kullanım için custom hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}; 