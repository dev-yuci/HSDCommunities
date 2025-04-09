'use client';

import { useState } from 'react';
import clubs from '@/data/clubsData';
import ClubCard from './ClubCard';

const areas = ['Tümü', 'Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'];

export default function ClubList() {
  const [selectedArea, setSelectedArea] = useState<string>('Tümü');

  const filteredClubs = selectedArea === 'Tümü' ? clubs : clubs.filter(club => club.area === selectedArea);

  return (
    <div>
      <div className="mb-4">
        {areas.map(area => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`mr-2 p-2 rounded ${selectedArea === area ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            {area}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
