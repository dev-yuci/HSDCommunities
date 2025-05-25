import React from 'react';

interface EventFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function EventFilters({ activeFilter, setActiveFilter }: EventFiltersProps) {
  // Tüm kategoriler
  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'Eğitim', name: 'Eğitim' },
    { id: 'Workshop', name: 'Workshop' },
    { id: 'Konferans', name: 'Konferans' },
    { id: 'Webinar', name: 'Webinar' },
    { id: 'Hackathon', name: 'Hackathon' },
    { id: 'Kariyer', name: 'Kariyer' },
    { id: 'Networking', name: 'Networking' }
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === category.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 