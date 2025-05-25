import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase-config';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';

// Firestore Event tipi
export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date | Timestamp;
  location: string;
  imageUrl: string;
  category: string;
  isRegistered?: boolean;
  capacity: number;
  registeredCount: number;
};

interface EventCardProps {
  event: Event;
  onRegister: () => void;
  onUnregister: () => void;
}

export default function EventCard({ event, onRegister, onUnregister }: EventCardProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { user } = useFirestoreAuthContext();
  
  const remainingSpots = event.capacity - event.registeredCount;
  const availabilityPercentage = (event.registeredCount / event.capacity) * 100;
  
  // Timestamp veya Date nesnesini formatlamak için yardımcı fonksiyon
  const getFormattedDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return formatDate(date.toDate());
    }
    return formatDate(date);
  };
  
  const handleRegisterClick = () => {
    setShowRegistrationModal(true);
  };
  
  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    // Eğer başarılı kayıt olduysa, 5 saniye sonra başarı durumunu sıfırla
    if (registrationSuccess) {
      setTimeout(() => {
        setRegistrationSuccess(false);
      }, 5000);
    }
  };
  
  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  };
  
  return (
    <>
      <div className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
        {/* Etkinlik resmi */}
        <div className="relative h-36 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://img.freepik.com/free-vector/flat-design-abstract-background_23-2149120347.jpg';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
              {event.category}
            </span>
          </div>
        </div>
        
        {/* Etkinlik bilgileri */}
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{event.title}</h3>
          
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{getFormattedDate(event.date)}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
            {event.description}
          </p>
          
          {/* Doluluk çubuğu */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {remainingSpots > 0 ? `${remainingSpots} kişilik kontenjan kaldı` : 'Kontenjan doldu'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {event.registeredCount}/{event.capacity}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${availabilityPercentage >= 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Kayıt butonu */}
          {event.isRegistered ? (
            <button
              onClick={onUnregister}
              className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors"
            >
              Kaydı İptal Et
            </button>
          ) : (
            <button
              onClick={handleRegisterClick}
              disabled={remainingSpots <= 0}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                remainingSpots <= 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              {remainingSpots <= 0 ? 'Kontenjan Doldu' : 'Etkinliğe Kayıt Ol'}
            </button>
          )}
        </div>
      </div>
      
      {/* Şık Kayıt Modalı */}
      {showRegistrationModal && (
        <RegistrationModal 
          event={event}
          isOpen={showRegistrationModal}
          onClose={handleCloseModal}
          onSuccess={handleRegistrationSuccess}
          showSuccess={registrationSuccess}
          userId={user?.uid || ''}
          userEmail={user?.email || ''}
        />
      )}
    </>
  );
}

// Şık Kayıt Modal Bileşeni
interface RegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showSuccess: boolean;
  userId: string;
  userEmail: string;
}

function RegistrationModal({ 
  event, 
  isOpen, 
  onClose, 
  onSuccess,
  showSuccess,
  userId,
  userEmail 
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail || '',
    phone: '',
    comment: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Ad Soyad, E-posta ve Telefon alanları zorunludur.');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Firestore'a kayıt ekleme
      const registrationDoc = await addDoc(collection(db, 'eventRegistrations'), {
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        userId,
        userEmail: formData.email,
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
        createdAt: serverTimestamp(),
        status: 'registered' // registered, cancelled, attended
      });
      
      // Etkinlik kaydı e-postası gönder
      try {
        // API endpointi ile e-posta gönderme isteği
        const emailResponse = await fetch('/api/send-mail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            eventTitle: event.title,
            eventDate: event.date, 
            eventLocation: event.location,
            userName: formData.name
          }),
        });
        
        const emailResult = await emailResponse.json();
        
        if (!emailResult.success) {
          console.warn('Onay e-postası gönderilemedi:', emailResult.error);
        }
      } catch (emailError) {
        console.error('E-posta gönderimi sırasında hata:', emailError);
        // E-posta gönderiminde hata olsa bile kayıt işlemini tamamla
      }
      
      setIsLoading(false);
      onSuccess();
      
      // 3 saniye sonra modalı kapat
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      setIsLoading(false);
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Etkinlik kaydı sırasında hata:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay - Koyu renkli arkaplan */}
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" aria-hidden="true" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full mx-4 z-10">
        {/* Modal başlık ve kapat butonu */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 px-5 py-4 sm:px-6 sm:py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-white">
            {event.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center text-sm text-blue-100">
            <div className="flex items-center mr-4 mb-1">
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {event.date instanceof Timestamp 
                  ? event.date.toDate().toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : event.date.toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                }
              </span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        
        {/* Modal içeriği */}
        <div className="bg-white dark:bg-gray-800 px-5 py-6 sm:px-6">
          {showSuccess ? (
            <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-2 rounded-md animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Kayıt Başarılı!</h4>
                  <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Etkinlik kaydınız başarıyla oluşturuldu. Etkinlik detayları için {formData.email} adresini kontrol edebilirsiniz.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Adınız ve soyadınız"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="ornek@mail.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="05XX XXX XX XX"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Eklemek İstedikleriniz
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Etkinlikle ilgili eklemek istediğiniz notlar..."
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-md shadow-sm focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </div>
                  ) : (
                    'Kaydı Tamamla'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 