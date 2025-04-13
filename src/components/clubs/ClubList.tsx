'use client';

import { useState } from 'react';
import clubs from '@/data/clubsData';
import ClubCard from './ClubCard';

const areas = ['Tümü', 'Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'];

// Bölge için bölge renkleri ve ikonları
const areaColors: Record<string, string> = {
  'Tümü': 'from-blue-700 to-indigo-700',
  'Marmara': 'from-blue-600 to-blue-800',
  'Ege': 'from-teal-600 to-teal-800',
  'Akdeniz': 'from-orange-600 to-orange-800',
  'İç Anadolu': 'from-yellow-600 to-yellow-800',
  'Karadeniz': 'from-green-600 to-green-800',
  'Doğu Anadolu': 'from-red-600 to-red-800',
  'Güneydoğu Anadolu': 'from-purple-600 to-purple-800'
};

// Bölge için ikonlar
const areaIcons: Record<string, string> = {
  'Tümü': '🗺️',
  'Marmara': '🏙️',
  'Ege': '🏖️',
  'Akdeniz': '☀️',
  'İç Anadolu': '🌾',
  'Karadeniz': '🌲',
  'Doğu Anadolu': '⛰️',
  'Güneydoğu Anadolu': '🏛️'
};

export default function ClubList() {
  const [selectedArea, setSelectedArea] = useState<string>('Tümü');
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredClubs = clubs.filter(club => 
    (selectedArea === 'Tümü' || club.area === selectedArea) &&
    (searchQuery === '' || club.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Arama Kutusu */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <input
          type="text"
          placeholder="Topluluk ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Bölge Filtreleri */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-700 rounded-full mr-2"></span>
          <span>Bölgeye Göre Filtrele</span>
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              onMouseEnter={() => setHoveredArea(area)}
              onMouseLeave={() => setHoveredArea(null)}
              className={`relative px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                ${selectedArea === area 
                  ? `bg-gradient-to-r ${areaColors[area]} text-white shadow-lg` 
                  : hoveredArea === area 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span>{areaIcons[area]}</span>
                <span>{area}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Topluluk Sayısı */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800">
          {filteredClubs.length} topluluk bulundu
        </h3>
      </div>
      
      {/* Topluluk Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
      
      {/* Sonuç Bulunamadı */}
      {filteredClubs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Bu bölgede topluluk bulunamadı</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {selectedArea} bölgesinde henüz aktif bir HSD topluluğu bulunmuyor. 
          </p>
          <button 
            onClick={() => setSelectedArea('Tümü')} 
            className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm Toplulukları Göster
          </button>
        </div>
      )}
    </div>
  );
}
