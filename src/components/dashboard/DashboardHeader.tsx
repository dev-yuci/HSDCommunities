'use client';

import React from 'react';

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 