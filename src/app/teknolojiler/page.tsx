'use client';

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import TechnologiesList from "@/components/technologies/TechnologiesList";
import Footer from "@/components/layout/Footer";
import technologiesData from '@/data/technologies.json';

// Popüler kategorileri çıkarma
const popularCategories = Array.from(
  new Set(technologiesData.map(tech => tech.category))
).slice(0, 4); // İlk 4 kategoriyi al

export default function TechnologiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryScroll = (category: string = 'Tümü') => {
    // Kategorilere kaydırma yapacak
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
      // Seçilen kategoriyi aktif hale getir
      setSelectedCategory(category);
    }
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
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handleCategoryScroll()}
                  className="inline-flex items-center gap-2 py-2 px-4 bg-white text-blue-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:bg-blue-50 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Tüm Kategoriler
                </button>
                
                {/* Popüler Kategori Butonları */}
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {popularCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryScroll(category)}
                      className="py-2 px-3 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-white text-sm rounded-lg transition-all hover:shadow-md"
                    >
                      {category}
                    </button>
                  ))}
                </div>
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
