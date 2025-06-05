import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BlogList from '@/components/dashboard/blog/BlogList';


export default function BlogDashboardPage() {
  return (
    <div className="p-6">
      <BlogList />
    </div>
  );
} 