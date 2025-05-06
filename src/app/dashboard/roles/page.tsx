import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RoleList from '@/components/dashboard/roles/RoleList';

export default function RolesPage() {
  return (
    <div>
      <DashboardHeader 
        title="Roller" 
        description="Kullanıcı rollerini ve izinlerini yönetin"
      />
      
      <div className="mt-6">
        <RoleList />
      </div>
    </div>
  );
} 