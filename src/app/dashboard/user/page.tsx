'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useFirestoreAuthContext } from '@/contexts/FirestoreAuthContext';
import UserDashboard from '@/components/dashboard/user/UserDashboard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function UserDashboardPage() {
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
        title="Kullanıcı Paneli" 
        description="Etkinlikleri görüntüle, kayıt ol ve bildirimlerini yönet"
      />
      
      {isLoading ? (
        <div className="mt-6 space-y-6">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
        </div>
      ) : (
        <UserDashboard user={user} />
      )}
    </div>
  );
} 