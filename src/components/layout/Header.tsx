'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/' && !isLoginPage && !isRegisterPage
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } text-sm font-medium`}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/events" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/events' 
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } text-sm font-medium`}
              >
                Etkinlikler
              </Link>
              <Link 
                href="/clubs" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/clubs' 
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } text-sm font-medium`}
              >
                Kulüpler
              </Link>
              <Link 
                href="/technologies" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/technologies' 
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } text-sm font-medium`}
              >
                Teknolojiler
              </Link>
              <Link 
                href="/blog" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/blog' 
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } text-sm font-medium`}
              >
                Blog
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Kulübe Katıl</Button>
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Menüyü aç</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                pathname === '/' && !isLoginPage && !isRegisterPage
                  ? 'border-blue-500 text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              } text-base font-medium`}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/events" 
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                pathname === '/events'
                  ? 'border-blue-500 text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              } text-base font-medium`}
            >
              Etkinlikler
            </Link>
            <Link 
              href="/clubs" 
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                pathname === '/clubs'
                  ? 'border-blue-500 text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              } text-base font-medium`}
            >
              Kulüpler
            </Link>
            <Link 
              href="/technologies" 
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                pathname === '/technologies'
                  ? 'border-blue-500 text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              } text-base font-medium`}
            >
              Teknolojiler
            </Link>
            <Link 
              href="/blog" 
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                pathname === '/blog'
                  ? 'border-blue-500 text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              } text-base font-medium`}
            >
              Blog
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2 px-4">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">Giriş Yap</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="primary" className="w-full">Kulübe Katıl</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 