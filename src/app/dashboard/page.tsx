'use client';

import React, { useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem } from '@/lib/firestoreAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useFirestoreAuthContext();
  
  useEffect(() => {
    const userRole = safeGetItem('user_role');
    
    // Normal kullanıcıları kullanıcı paneline yönlendir
    if (userRole === 'user') {
      // router.push yerine router.replace kullanarak daha temiz yönlendirme yapalım
      router.replace('/dashboard/user');
      return;
    }
  }, [router]); // sadece router bağımlılığı yeterli
  
  // Örnek istatistikler
  const stats = [
    { name: 'Toplam Etkinlik', stat: '12', url: '/dashboard/events' },
    { name: 'Aktif Kulüpler', stat: '5', url: '/dashboard/clubs' },
    { name: 'Yapılacaklar', stat: '24', url: '/dashboard/todos' },
    { name: 'Toplam Üye', stat: '128', url: '/dashboard/roles' },
  ];

  return (
    <div>
      <DashboardHeader 
        title="Admin Dashboard" 
        description="HSD Toplulukları yönetim paneline hoş geldiniz."
      />

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <Link key={item.name} href={item.url} className="block">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">
                    {item.stat}
                  </dd>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Son Etkinlikler Kartı */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Son Etkinlikler
            </h3>
            <Link href="/dashboard/events" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Tümünü Gör
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <div key={event} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Yapay Zeka Workshop #{event}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        10 Mayıs 2025 • 15:00
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yapılacaklar Kartı */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Yapılacaklar
            </h3>
            <Link href="/dashboard/todos" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Tümünü Gör
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[
                { id: 1, name: 'Etkinlik planını tamamla', completed: true },
                { id: 2, name: 'Konuşmacılarla iletişime geç', completed: false },
                { id: 3, name: 'Sosyal medya duyurularını hazırla', completed: false },
              ].map((todo) => (
                <div key={todo.id} className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded border ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center`}>
                    {todo.completed && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {todo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 