'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { safeGetItem, safeSetItem, safeRemoveItem } from '@/lib/firestoreAuth';

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const router = useRouter();
  const { login, user, role, logout } = useFirestoreAuthContext();

  // Sayfa yüklendiğinde veya kullanıcı güncellendiğinde kontrol et
  useEffect(() => {
    // LocalStorage'da token varsa kullanıcı oturum açmış demektir
    const token = safeGetItem('auth_token');
    
    // Kullanıcı veya token mevcutsa ve daha önce yönlendirme yapılmadıysa
    if ((user || token) && !redirected) {
      console.log('Kullanıcı oturum açmış, dashboard\'a yönlendiriliyor...');
      console.log('Kullanıcı rolü:', role);
      setRedirected(true);
      
      // İki yönlendirme yöntemini de deneyelim
      // 1. Next.js router ile
      router.push('/dashboard');
      
      // 2. Doğrudan URL değişikliği ile - router.push çalışmazsa bu çalışır
      setTimeout(() => {
        if (isBrowser() && window.location.pathname !== '/dashboard') {
          window.location.href = '/dashboard';
        }
      }, 500);
    }
  }, [user, router, redirected, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        // Hata kodlarını Türkçe mesajlara dönüştür
        if (result.error.code === 'auth/wrong-credentials') {
          setError('E-posta veya şifre hatalı.');
        } else if (result.error.code === 'auth/user-not-found') {
          setError('Bu e-posta adresine sahip kullanıcı bulunamadı.');
        } else if (result.error.code === 'auth/auth-document-not-found') {
          setError('Kimlik doğrulama belgesi bulunamadı.');
        } else {
          setError(`Giriş hatası: ${result.error.message}`);
        }
      } else if (result.user) {
        console.log('Başarılı giriş:', result.user.displayName);
        console.log('Kullanıcı rolü:', result.user.role);
        
        // Remember me seçeneğini kaydet
        if (rememberMe) {
          safeSetItem('remember_me', 'true');
        } else {
          safeRemoveItem('remember_me');
        }
        
        // Yönlendirmeyi doğrudan burada yapalım
        setRedirected(true);
        
        // İki yönlendirme yöntemini de deneyelim
        // 1. Next.js router ile
        router.push('/dashboard');
        
        // 2. Doğrudan URL değişikliği ile - router.push çalışmazsa bu çalışır
        setTimeout(() => {
          if (isBrowser()) {
            window.location.href = '/dashboard';
          }
        }, 500);
      }
    } catch (err: any) {
      setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">HSD Giriş</h1>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-posta adresinizi girin"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Şifre
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifrenizi girin"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`block h-5 w-5 rounded border ${rememberMe ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors`}></div>
                  <div className={`dot absolute left-0.5 top-0.5 h-4 w-4 rounded-sm bg-blue-500 transition-all ${rememberMe ? 'opacity-20 scale-75' : 'opacity-0 scale-0'}`}></div>
                  <svg 
                    className={`absolute left-0.5 top-0.5 h-4 w-4 text-blue-500 transition-all ${rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">Beni hatırla</span>
              </label>
            </div>
            
            <div className="mb-6">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 flex items-center justify-center relative"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </div>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">veya</span>
            </div>
          </div>
          
          <div>
            <Link href="/register" className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors group text-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Yeni Hesap Oluştur
              </span>
            </Link>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 