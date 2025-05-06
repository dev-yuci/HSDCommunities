'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ClubForm from './ClubForm';
import Image from 'next/image';

export interface Club {
  id: string;
  name: string;
  description: string;
  foundingDate: string;
  logo: string;
  memberCount: number;
  contactEmail: string;
  website: string;
  category: 'technology' | 'art' | 'science' | 'social' | 'sports';
}

const initialClubs: Club[] = [
  {
    id: '1',
    name: 'Yazılım Kulübü',
    description: 'Yazılım geliştirme ve teknoloji odaklı öğrenci kulübü.',
    foundingDate: '2020-03-15',
    logo: '/images/clubs/software-club-logo.png',
    memberCount: 75,
    contactEmail: 'yazilim@example.com',
    website: 'https://yazilimkulubu.com',
    category: 'technology',
  },
  {
    id: '2',
    name: 'Blockchain Kulübü',
    description: 'Blockchain teknolojileri hakkında araştırma ve eğitimler.',
    foundingDate: '2021-09-10',
    logo: '/images/clubs/blockchain-club-logo.png',
    memberCount: 42,
    contactEmail: 'blockchain@example.com',
    website: 'https://blockchainkulubu.com',
    category: 'technology',
  },
  {
    id: '3',
    name: 'Yapay Zeka Kulübü',
    description: 'Yapay zeka ve makine öğrenmesi hakkında çalışmalar yapan topluluk.',
    foundingDate: '2022-01-05',
    logo: '/images/clubs/ai-club-logo.png',
    memberCount: 53,
    contactEmail: 'ai@example.com',
    website: 'https://aikulubu.com',
    category: 'science',
  },
];

export default function ClubList() {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | undefined>(undefined);

  const handleAddClub = (clubData: Omit<Club, 'id'>) => {
    const newClub: Club = {
      id: uuidv4(),
      ...clubData,
    };

    setClubs([...clubs, newClub]);
    setIsFormOpen(false);
  };

  const handleEditClub = (clubData: Omit<Club, 'id'>) => {
    if (!editingClub) return;

    setClubs(
      clubs.map((club) =>
        club.id === editingClub.id
          ? { ...club, ...clubData }
          : club
      )
    );

    setEditingClub(undefined);
  };

  const handleDelete = (id: string) => {
    setClubs(clubs.filter((club) => club.id !== id));
  };

  const startEdit = (club: Club) => {
    setEditingClub(club);
  };

  const cancelEdit = () => {
    setEditingClub(undefined);
    setIsFormOpen(false);
  };

  const getCategoryBadge = (category: Club['category']) => {
    const badges = {
      technology: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      art: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      science: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      social: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      sports: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };

    const labels = {
      technology: 'Teknoloji',
      art: 'Sanat',
      science: 'Bilim',
      social: 'Sosyal',
      sports: 'Spor',
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[category]}`}>
        {labels[category]}
      </span>
    );
  };

  return (
    <div>
      {(isFormOpen || editingClub) && (
        <div className="mb-8">
          <ClubForm
            club={editingClub}
            onSubmit={editingClub ? handleEditClub : handleAddClub}
            onCancel={cancelEdit}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Kulüpler ({clubs.length})
        </h3>
        
        {!isFormOpen && !editingClub && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Kulüp
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <div key={club.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center mb-4">
                {club.logo ? (
                  <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4">
                    <img src={club.logo} alt={`${club.name} logo`} className="h-12 w-12 object-cover" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {club.name.substring(0, 1)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {club.name}
                  </h3>
                  <div className="mt-1">
                    {getCategoryBadge(club.category)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">{club.description}</p>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <div>
                  <span className="font-medium">Kuruluş:</span>{' '}
                  {new Date(club.foundingDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div>
                  <span className="font-medium">Üye Sayısı:</span> {club.memberCount}
                </div>
                <div className="truncate">
                  <span className="font-medium">E-posta:</span> {club.contactEmail}
                </div>
                {club.website && (
                  <div className="truncate">
                    <span className="font-medium">Web:</span>{' '}
                    <a 
                      href={club.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {club.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end space-x-3">
                <button
                  onClick={() => startEdit(club)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(club.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}

        {clubs.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            Henüz kulüp bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
} 