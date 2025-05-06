import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ClubList from '@/components/dashboard/clubs/ClubList';

export default function ClubsPage() {
  return (
    <div>
      <DashboardHeader 
        title="Kulüpler" 
        description="HSD Topluluğu bünyesindeki kulüpleri yönetin"
      />
      
      <div className="mt-6">
        <ClubList />
      </div>
    </div>
  );
} 