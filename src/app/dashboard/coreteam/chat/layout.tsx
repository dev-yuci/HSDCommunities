'use client';

import React from 'react';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CoreTeamChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useFirestoreAuthContext();
  const router = useRouter();

  // Yetki kontrolü
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!loading && user && user.role !== 'coreteam' && user.role !== 'admin') {
      if (user.role === 'user') {
        router.replace('/dashboard/user');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Header - Ana menüye dönüş butonuyla */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button 
                  onClick={() => router.push('/dashboard/coreteam')}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Panele Dön
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.displayName || 'Kullanıcı'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 