'use client'

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: ButtonProps) {
  const baseClasses = "rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-red-500"
  };
  
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-2.5 px-5 text-lg"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 