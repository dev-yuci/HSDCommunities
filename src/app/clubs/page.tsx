'use client';

import React from 'react';
import ClubList from '@/components/clubs/ClubList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 rounded-l-full transform translate-x-1/3"></div>
          <div className="absolute left-0 bottom-0 h-64 w-64 bg-indigo-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                HSD Toplulukları
              </h1>
              <p className="text-lg text-indigo-100 mb-8 max-w-lg">
                Türkiye'nin dört bir yanındaki üniversitelerde faaliyet gösteren HSD topluluklarını keşfedin. 
                Etkinlikler, projeler ve eğitimlerle yazılım dünyasında birlikte gelişiyoruz.
              </p>
              
              {/* İstatistikler */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">40+</div>
                  <div className="text-xs text-indigo-200">Topluluk</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">30+</div>
                  <div className="text-xs text-indigo-200">Üniversite</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">5000+</div>
                  <div className="text-xs text-indigo-200">Üye</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold mb-1">200+</div>
                  <div className="text-xs text-indigo-200">Etkinlik</div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 relative">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-32 h-32 text-white"
                    fill="currentColor"
                  >
                    <path d="M100,15 L120,50 L160,60 L130,90 L140,130 L100,110 L60,130 L70,90 L40,60 L80,50 Z" />
                  </svg>
                </div>
                {/* Topluluk simgeleri */}
                <div className="absolute top-10 left-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-lg text-xl">🏫</div>
                <div className="absolute top-0 right-10 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-lg text-xl">👥</div>
                <div className="absolute bottom-10 right-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg text-xl">📚</div>
                <div className="absolute bottom-0 left-10 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-lg text-xl">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">Türkiye'deki Topluluklarımız</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Bilgi paylaştıkça çoğalır. HSD toplulukları olarak, yazılım ve teknoloji alanında bilgi paylaşımı yaparak geleceğin teknoloji liderlerini yetiştiriyoruz.</p>
        </div>
        <ClubList />
      </main>
      
      <Footer />
    </div>
  );
}
