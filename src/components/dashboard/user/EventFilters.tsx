import React from 'react';

interface EventFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

// Kategori filtreleri
const filters = [
  { id: 'all', name: 'Tümü' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'eğitim', name: 'Eğitim' },
  { id: 'konferans', name: 'Konferans' },
  { id: 'kariyer', name: 'Kariyer' },
];

export default function EventFilters({ activeFilter, setActiveFilter }: EventFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${activeFilter === filter.id
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
} 