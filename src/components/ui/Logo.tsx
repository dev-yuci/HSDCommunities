'use client'

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <svg 
        width="42" 
        height="42" 
        viewBox="0 0 100 100" 
        className="mr-2" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Huawei modern teknoloji logosu - Ağ bağlantıları ve dayanıklılık konsepti */}
        <defs>
          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        
        <g transform="translate(50 50)">
          {/* Merkez altıgen */}
          <path 
            d="M0,-25 L21.65,-12.5 L21.65,12.5 L0,25 L-21.65,12.5 L-21.65,-12.5 Z" 
            fill="url(#techGradient)"
            opacity="0.9"
          />
          
          {/* Bağlantı çizgileri */}
          <g>
            <path d="M0,-25 L0,-35" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d="M21.65,12.5 L30,18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d="M-21.65,12.5 L-30,18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d="M21.65,-12.5 L30,-18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d="M-21.65,-12.5 L-30,-18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,25 L0,35" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            
            {/* Bağlantı noktaları */}
            <circle cx="0" cy="-35" r="4" fill="url(#nodeGradient)" />
            <circle cx="30" cy="18" r="4" fill="url(#nodeGradient)" />
            <circle cx="-30" cy="18" r="4" fill="url(#nodeGradient)" />
            <circle cx="30" cy="-18" r="4" fill="url(#nodeGradient)" />
            <circle cx="-30" cy="-18" r="4" fill="url(#nodeGradient)" />
            <circle cx="0" cy="35" r="4" fill="url(#nodeGradient)" />
          </g>
          
          {/* İç yapı */}
          <path 
            d="M0,-12 L10.4,-6 L10.4,6 L0,12 L-10.4,6 L-10.4,-6 Z" 
            fill="#FFFFFF"
            opacity="0.25"
          />
          
          {/* Merkez nokta */}
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.85" />
        </g>
      </svg>
      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">HSD Türkiye</span>
    </Link>
  );
} 