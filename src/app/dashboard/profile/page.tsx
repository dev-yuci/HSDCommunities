'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import ProfileSettings from '@/components/dashboard/profile/ProfileSettings';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileSettingsPage() {
  const { user, loading } = useFirestoreAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Auth yüklemesi bittikten sonra sayfa içeriğinin yüklenmesini simüle et
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div>
      <DashboardHeader 
        title="Profil Ayarları" 
        description="Kişisel bilgilerinizi ve hesap ayarlarınızı güncelleyin"
      />
      
      {isLoading ? (
        <div className="mt-6 space-y-6">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>
      ) : (
        <ProfileSettings user={user} />
      )}
    </div>
  );
} 