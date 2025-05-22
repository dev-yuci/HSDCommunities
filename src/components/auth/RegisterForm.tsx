'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyA0JUa-hUkaIfbXLMvntJ6Lfg3cvhvYhVo",
  authDomain: "hsd-communities.firebaseapp.com",
  projectId: "hsd-communities",
  storageBucket: "hsd-communities.firebasestorage.app",
  messagingSenderId: "492790104716",
  appId: "1:492790104716:web:1ecd22b5073765117fb1a9"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Form doğrulaması
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (!acceptTerms) {
      setError('Devam etmek için kullanım koşullarını kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Kullanıcı verilerini hazırla
      const userData = {
        email: email,
        password: password,
        displayName: name,
        role: 'user', // Varsayılan rol
        createdAt: new Date().toISOString()
      };
      
      // Kullanıcıyı Firestore'a kaydet
      // Not: Gerçek bir sistemde şifre asla düz metin olarak saklanmamalıdır
      // Bu örnek sadece gösterim amaçlıdır
      
      // auth koleksiyonunda kullanıcıya özel bir belge oluştur
      const userDocRef = doc(db, 'users', email);
      await setDoc(userDocRef, userData);
      
      // Kullanıcıyı login sayfasına yönlendir
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">HSD Kayıt</h1>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ad Soyad"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@university.edu.tr"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Şifre Tekrarı
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    required
                  />
                  <div className={`block h-5 w-5 rounded border ${acceptTerms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors`}></div>
                  <div className={`dot absolute left-0.5 top-0.5 h-4 w-4 rounded-sm bg-blue-500 transition-all ${acceptTerms ? 'opacity-20 scale-75' : 'opacity-0 scale-0'}`}></div>
                  <svg 
                    className={`absolute left-0.5 top-0.5 h-4 w-4 text-blue-500 transition-all ${acceptTerms ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
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
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                  <span>
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Kullanım Koşullarını
                    </Link>
                    {' '}ve{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Gizlilik Politikasını
                    </Link>
                    {' '}kabul ediyorum
                  </span>
                </span>
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
                  'Kayıt Ol'
                )}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten bir hesabınız var mı?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 