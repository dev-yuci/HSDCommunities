'use client';

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import TechnologiesList from "@/components/technologies/TechnologiesList";
import Footer from "@/components/layout/Footer";
import technologiesData from '@/data/technologies.json';

// Kategorileri veri dosyasından çıkarma
const allCategories = Array.from(
  new Set(technologiesData.map(tech => tech.category))
);

// Her kategori için teknoloji sayılarını hesapla
const categoryStats = allCategories.reduce((acc, category) => {
  acc[category] = technologiesData.filter(tech => tech.category === category).length;
  return acc;
}, {} as Record<string, number>);

// Teknoloji sayısına göre sırala ve ilk 4'ünü al
const popularCategories = [...allCategories]
  .sort((a, b) => categoryStats[b] - categoryStats[a])
  .slice(0, 4);

export default function TechnologiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryScroll = (category: string = 'Tümü') => {
    // Kategorilere kaydırma yapacak
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
      // Seçilen kategoriyi aktif hale getir
      setSelectedCategory(category);
    }
  };

  // Kategori için ikon belirleme
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Yapay Zeka': '🤖',
      'Bulut Altyapısı': '☁️',
      'Veritabanı': '🗄️',
      'Güvenlik': '🔒',
      'DevOps': '⚙️',
      'Sunucusuz': '📡',
      'IoT': '📱',
      'Veri Analitiği': '📊',
      'Depolama': '💾',
      'Ağ': '🔌',
      'Ağ İşlemleri': '🔌',
      'Bilgi İşlem': '💻'
    };
    
    return icons[category] || '🔍';
  };

  // Kategori için ikon arkaplan rengi belirleme
  const getCategoryIconBg = (category: string) => {
    const colors: Record<string, string> = {
      'Depolama': 'bg-amber-100 text-amber-600',
      'Veritabanı': 'bg-teal-100 text-teal-600',
      'Bilgi İşlem': 'bg-blue-100 text-blue-600',
      'Ağ İşlemleri': 'bg-teal-100 text-teal-600',
      'Ağ': 'bg-teal-100 text-teal-600',
      'Yapay Zeka': 'bg-purple-100 text-purple-600',
      'Güvenlik': 'bg-red-100 text-red-600',
      'Bulut Altyapısı': 'bg-blue-100 text-blue-600',
      'DevOps': 'bg-green-100 text-green-600',
      'Sunucusuz': 'bg-indigo-100 text-indigo-600',
      'IoT': 'bg-orange-100 text-orange-600',
      'Veri Analitiği': 'bg-violet-100 text-violet-600'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 rounded-l-full transform translate-x-1/3"></div>
          <div className="absolute left-0 bottom-0 h-64 w-64 bg-blue-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Huawei Cloud Teknolojileri
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Modern iş ihtiyaçlarınızı karşılayacak geniş hizmet yelpazemizi keşfedin. 
                Bulut altyapısından, yapay zeka çözümlerine kadar her alanda yanınızdayız.
              </p>
              
              {/* "Daha Fazla" Butonu */}
              <div className="flex justify-center mb-10">
                <button 
                  onClick={() => handleCategoryScroll()}
                  className="bg-white group hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="font-medium">Tüm Teknolojileri Keşfet</span>
                  <div className="bg-blue-600 rounded-full p-1 group-hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>
              
              {/* Popüler Kategori Kartları */}
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map((category) => (
                  <div 
                    key={category}
                    onClick={() => handleCategoryScroll(category)}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                      ${hoveredCategory === category 
                        ? 'bg-white text-blue-700 shadow-lg scale-105' 
                        : 'bg-blue-500/20 text-white hover:bg-blue-500/30'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryIconBg(category)}`}>
                        <span className="text-xl">{getCategoryIcon(category)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-xs opacity-80">{categoryStats[category]} teknoloji</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 relative">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  ☁️
                </div>
                {/* Teknoloji simgeleri */}
                <div className="absolute top-10 left-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-lg text-xl">🖥️</div>
                <div className="absolute top-0 right-10 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg text-xl">📦</div>
                <div className="absolute bottom-10 right-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-lg text-xl">🤖</div>
                <div className="absolute bottom-0 left-10 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-lg text-xl">🔒</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <TechnologiesList initialCategory={selectedCategory} />
      </main>

      <Footer />
    </div>
  );
}
