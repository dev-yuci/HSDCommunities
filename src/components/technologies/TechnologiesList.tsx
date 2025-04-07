'use client';

import React, { useState, useEffect } from 'react';
import TechnologyCard from './TechnologyCard';
import technologiesData from '@/data/technologies.json';

// Kategorileri veri dosyasından çıkarma
const categories = ['Tümü', ...Array.from(new Set(technologiesData.map(tech => tech.category)))];

interface TechnologiesListProps {
  initialCategory?: string | null;
}

const TechnologiesList: React.FC<TechnologiesListProps> = ({ initialCategory = null }) => {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // initialCategory değiştiğinde aktif kategoriyi güncelle
  useEffect(() => {
    if (initialCategory && categories.includes(initialCategory)) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Kategori değiştirme fonksiyonu
  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    
    setLoadingCategory(category);
    setIsLoading(true);
    
    // Yavaş bağlantılarda bile animasyon gözükmesi için kısa bir gecikme
    setTimeout(() => {
      setActiveCategory(category);
      setIsLoading(false);
    }, 300);
  };

  // Arama ve kategori filtrelemesi
  const filteredTechnologies = technologiesData
    .filter(tech => 
      (activeCategory === 'Tümü' || tech.category === activeCategory) &&
      (searchQuery === '' || 
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Kategori Başlığı */}
      <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Huawei Cloud Teknolojileri
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Modern iş ihtiyaçlarınızı karşılayacak bulut tabanlı çözümlerimizi keşfedin.
      </p>
      
      {/* Arama ve Filtreleme */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Arama Kutusu */}
          <div className="relative w-full lg:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Teknoloji ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          {/* Kategori Filtreleri */}
          <div id="categories" className="flex-1 overflow-x-auto scroll-mt-24 pb-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-max">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  disabled={isLoading}
                  className={`px-4 py-2.5 rounded-xl text-sm md:text-base transition-all duration-300 relative whitespace-nowrap
                    ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-medium'
                        : loadingCategory === category && isLoading
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                    }
                    ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                  `}
                >
                  {category}
                  {loadingCategory === category && isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sonuç Bilgisi */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mr-3">
            {activeCategory}
          </h3>
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1.5 rounded-full font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {filteredTechnologies.length} teknoloji
          </span>
        </div>
        
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aramayı Temizle
          </button>
        )}
      </div>
      
      {/* Teknoloji Kartları */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ${isLoading ? 'opacity-50 scale-98' : 'opacity-100 scale-100'}`}>
        {filteredTechnologies.map((tech, index) => (
          <div 
            key={index} 
            className="transform transition-all duration-500 hover:-translate-y-2"
            style={{ 
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both'
            }}
          >
            <TechnologyCard
              title={tech.title}
              description={tech.description}
              icon={tech.icon}
              color={tech.color}
              url={tech.url}
            />
          </div>
        ))}
      </div>
      
      {/* Sonuç bulunamadı mesajı */}
      {filteredTechnologies.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Sonuç bulunamadı</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery ? 
              `"${searchQuery}" araması için ${activeCategory === 'Tümü' ? 'hiçbir teknoloji' : `"${activeCategory}" kategorisinde hiçbir teknoloji`} bulunamadı.` : 
              `Bu kategoride henüz teknoloji bulunmuyor.`
            }
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Aramayı Temizle
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TechnologiesList;