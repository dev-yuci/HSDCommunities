'use client';

import React, { useState, useEffect } from 'react';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import { updateUserProfile } from '@/lib/firestoreAuth';
import { safeGetItem } from '@/lib/firestoreAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

type ProfileSettingsProps = {
  user: any;
};

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    displayName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      displayName: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Ad Soyad kontrolü
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Ad Soyad alanı boş bırakılamaz';
      isValid = false;
    }

    // Şifre kontrolü (eğer şifre değiştiriliyorsa)
    if (formData.newPassword) {
      // Mevcut şifre kontrolü
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Mevcut şifrenizi girmelisiniz';
        isValid = false;
      }

      // Yeni şifre uzunluk kontrolü
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Şifre en az 6 karakter olmalıdır';
        isValid = false;
      }

      // Şifre eşleşme kontrolü
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hata mesajını temizle
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: { displayName?: string; password?: string } = {};

      // Sadece değiştirilmiş alanları gönder
      if (formData.displayName !== user.displayName) {
        updateData.displayName = formData.displayName;
      }

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      // Herhangi bir değişiklik yoksa işlemi sonlandır
      if (Object.keys(updateData).length === 0) {
        toast.success('Değişiklik yapılmadı');
        setIsSubmitting(false);
        return;
      }

      // Kullanıcı bilgilerini güncelle
      const result = await updateUserProfile(user.email, updateData);

      if (result.success) {
        toast.success('Profil bilgileriniz başarıyla güncellendi');
        
        // Şifre alanlarını temizle
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast.error(result.error?.message || 'Güncelleme sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>
            Kişisel bilgilerinizi ve hesap ayarlarınızı buradan güncelleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="displayName">Ad Soyad</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Ad Soyad"
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                E-posta adresi değiştirilemez.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium mb-4">Şifre Değiştir</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Mevcut şifreniz"
                    className={errors.currentPassword ? 'border-red-500' : ''}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Yeni şifreniz"
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Yeni şifrenizi tekrar girin"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Güncelleniyor...
                </>
              ) : 'Değişiklikleri Kaydet'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 