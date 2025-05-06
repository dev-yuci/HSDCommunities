'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Örnek kulüp listesi
  const clubs = [
    { id: 'yazilim', name: 'Yazılım Kulübü' },
    { id: 'blockchain', name: 'Blockchain Kulübü' },
    { id: 'yapay-zeka', name: 'Yapay Zeka Kulübü' },
    { id: 'siber-guvenlik', name: 'Siber Güvenlik Kulübü' },
    { id: 'tasarim', name: 'Tasarım Kulübü' },
  ];

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
    
    // Burada normalde API ile kayıt işlemi yapılır
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı kayıt simülasyonu
      console.log('Registered with:', { name, email, password, selectedClub });
      
      router.push('/login'); // Kayıt sonrası login sayfasına yönlendir
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true);
    // Google OAuth entegrasyonu simülasyonu
    setTimeout(() => {
      console.log('Registering with Google...');
      setIsGoogleLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">HSD Kayıt</h1>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
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
            
            <div className="mb-5">
              <label htmlFor="club" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kulüp Seçimi
              </label>
              <select
                id="club"
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Kulüp seçin</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
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
                variant="primary"
                className="w-full py-3 flex items-center justify-center relative"
                onClick={() => {}} // Form submit ile handle ediliyor
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
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full h-px bg-gray-200 dark:bg-gray-700">
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
                veya
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading || isGoogleLoading}
              className="w-full group flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isGoogleLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.1871C22.4448 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1881 21.1039L16.3239 18.1055C15.2482 18.8375 13.8584 19.252 12.2401 19.252C9.11137 19.252 6.45903 17.1399 5.50117 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                    <path d="M5.49612 14.3003C5.00779 12.8099 5.00779 11.1961 5.49612 9.70575V6.61481H1.51155C-0.18767 10.0056 -0.18767 14.0004 1.51155 17.3912L5.49612 14.3003Z" fill="#FBBC04"/>
                    <path d="M12.2401 4.74966C13.9511 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50117 9.70575C6.45903 6.86622 9.11137 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Google ile Kayıt Ol
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{' '}
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