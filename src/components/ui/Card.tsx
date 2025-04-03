import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl 
        border border-gray-200 dark:border-gray-700 
        shadow-sm 
        overflow-hidden
        ${hover ? 'transition-transform hover:shadow-md hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-5 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-5 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
} 