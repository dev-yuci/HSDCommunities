'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem } from '@/lib/firestoreAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAuthenticated } = useFirestoreAuthContext();
  const router = useRouter();

  // Auth kontrolü ve rol bazlı yönlendirme
  useEffect(() => {
    // Kullanıcı yoksa ve yükleme tamamlandıysa login sayfasına yönlendir
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Kullanıcı varsa, role göre yönlendirme yap
    if (!loading && isAuthenticated && user) {
      const userRole = safeGetItem('user_role') || 'user';
      const isAdmin = userRole === 'admin';
      const isUser = userRole === 'user';
      const pathname = window.location.pathname;
      
      // Kullanıcı admin değilse ve admin sayfalarına erişmeye çalışıyorsa
      if (!isAdmin && (
        pathname.includes('/dashboard/roles') || 
        pathname.includes('/dashboard/todos') || 
        pathname.includes('/dashboard/clubs')
      )) {
        router.push('/dashboard/user');
      }
      
      // Admin kullanıcı paneline girmeye çalışıyorsa
      if (isAdmin && pathname.includes('/dashboard/user')) {
        router.push('/dashboard');
      }
      
      // Kullanıcı user ise ve dashboard anasayfasına erişmeye çalışıyorsa
      if (isUser && pathname === '/dashboard') {
        router.push('/dashboard/user');
      }
    }
  }, [loading, isAuthenticated, router, user]);

  // Sayfa yüklenirken loading göster
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Yetkisiz erişim
  if (!isAuthenticated) {
    return null; // Router login'e yönlendirdiği için bir şey göstermeye gerek yok
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Kapat</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Sidebar />
        </div>

        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Menüyü aç</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 