import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
} 