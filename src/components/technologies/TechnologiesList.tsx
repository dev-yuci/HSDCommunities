'use client';

import React, { useState } from 'react';
import TechnologyCard from './TechnologyCard';
import technologies from '@/data/technologies.json';

const categories = Array.from(new Set(technologies.map((tech) => tech.category)));

export default function TechnologiesList() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filtered = technologies.filter((tech) => tech.category === activeCategory);

  return (
    <div className="px-4 pt-8 pb-16 w-full max-w-7xl mx-auto">
      {/* Kategori sekmeleri */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md border-2 tracking-wide 
              ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-indigo-600 scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Kart listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((tech, index) => (
          <TechnologyCard
            key={index}
            title={tech.title}
            description={tech.description}
            icon={tech.icon}
            color={tech.color}
            url={tech.url}
          />
        ))}
      </div>
    </div>
  );
}