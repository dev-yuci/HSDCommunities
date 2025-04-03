import React from 'react';
import Button from '../ui/Button';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-white dark:bg-gray-900 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <svg
            className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white dark:text-gray-900 lg:block"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative px-4 pt-6 sm:px-6 lg:px-8"></div>
          
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Huawei Student</span>{' '}
                <span className="block text-red-600 dark:text-red-400 xl:inline">Developers</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Huawei teknolojilerini öğrenmek, geliştirmek ve paylaşmak isteyen öğrenciler için Türkiye'nin en büyük öğrenci geliştirici topluluğuna katılın.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button size="lg" variant="primary" className="w-full">
                    Kulübe Katıl
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button size="lg" variant="outline" className="w-full">
                    Etkinlikleri Keşfet
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-br from-red-500 to-gray-800 object-cover sm:h-72 md:h-96 lg:h-full lg:w-full">
          <div className="h-full w-full bg-opacity-50 flex items-center justify-center">
            <svg width="220" height="220" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <defs>
                <linearGradient id="heroMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E0E0E0" />
                </linearGradient>
                <radialGradient id="heroGlowGradient" cx="0.5" cy="0.5" r="0.8" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <g transform="translate(50 50)">
                {/* Merkez altıgen - ana yapı */}
                <path 
                  d="M0,-25 L21.65,-12.5 L21.65,12.5 L0,25 L-21.65,12.5 L-21.65,-12.5 Z" 
                  fill="url(#heroMainGradient)"
                  opacity="0.95"
                  filter="url(#glow)"
                />
                
                {/* Parlama efekti - altıgenin arkasında */}
                <path 
                  d="M0,-25 L21.65,-12.5 L21.65,12.5 L0,25 L-21.65,12.5 L-21.65,-12.5 Z" 
                  fill="url(#heroGlowGradient)"
                  opacity="0.4"
                  transform="scale(1.15)"
                />
                
                {/* Bağlantı çizgileri */}
                <g>
                  <path d="M0,-25 L0,-35" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M21.65,12.5 L30,18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M-21.65,12.5 L-30,18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M21.65,-12.5 L30,-18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M-21.65,-12.5 L-30,-18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M0,25 L0,35" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  
                  {/* Bağlantı noktaları */}
                  <circle cx="0" cy="-35" r="3.5" fill="white" filter="url(#softGlow)" />
                  <circle cx="30" cy="18" r="3.5" fill="white" filter="url(#softGlow)" />
                  <circle cx="-30" cy="18" r="3.5" fill="white" filter="url(#softGlow)" />
                  <circle cx="30" cy="-18" r="3.5" fill="white" filter="url(#softGlow)" />
                  <circle cx="-30" cy="-18" r="3.5" fill="white" filter="url(#softGlow)" />
                  <circle cx="0" cy="35" r="3.5" fill="white" filter="url(#softGlow)" />
                </g>
                
                {/* İç yapı - ortadaki küçük altıgen */}
                <path 
                  d="M0,-12 L10.4,-6 L10.4,6 L0,12 L-10.4,6 L-10.4,-6 Z" 
                  fill="white"
                  opacity="0.6"
                />
                
                {/* Merkez nokta */}
                <circle cx="0" cy="0" r="4" fill="white" filter="url(#softGlow)" opacity="0.95" />
                
                {/* Ekstra ağ çizgileri - dinamik görünüm için */}
                <g opacity="0.6">
                  <path d="M30,18 L40,28" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M-30,18 L-40,28" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M30,-18 L40,-28" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M-30,-18 L-40,-28" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  
                  {/* Ekstra ağ noktaları */}
                  <circle cx="40" cy="28" r="2.5" fill="white" opacity="0.85" />
                  <circle cx="-40" cy="28" r="2.5" fill="white" opacity="0.85" />
                  <circle cx="40" cy="-28" r="2.5" fill="white" opacity="0.85" />
                  <circle cx="-40" cy="-28" r="2.5" fill="white" opacity="0.85" />
                </g>
                
                {/* İkincil bağlantılar - ekstra derinlik */}
                <g opacity="0.4">
                  <path d="M40,28 L45,32" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  <path d="M-40,28 L-45,32" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  <path d="M40,-28 L45,-32" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  <path d="M-40,-28 L-45,-32" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  
                  <circle cx="45" cy="32" r="1.8" fill="white" opacity="0.7" />
                  <circle cx="-45" cy="32" r="1.8" fill="white" opacity="0.7" />
                  <circle cx="45" cy="-32" r="1.8" fill="white" opacity="0.7" />
                  <circle cx="-45" cy="-32" r="1.8" fill="white" opacity="0.7" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 