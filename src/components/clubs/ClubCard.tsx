'use client';

import Link from 'next/link';
import { ArrowRightIcon, UsersIcon, MapPinIcon, CalendarIcon, TrophyIcon } from 'lucide-react';
import { ClubData } from '@/data/clubsData';

const normalizeSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9-]/g, '-') 
    .replace(/--+/g, '-') 
    .replace(/^-|-$/g, '');
};

export default function ClubCard({ club }: { club: ClubData }) {
  const slug = `/hcsd-${normalizeSlug(club.university)}`;

  return (
    <Link href={slug}>
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:translate-y-[-8px] group cursor-pointer h-full flex flex-col justify-between">
        <div className="space-y-4">
          {/* Başlık ve Üniversite */}
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <TrophyIcon size={18} />
              </div>
            </div>
            <p className="text-indigo-600 font-medium">{club.university}</p>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <MapPinIcon size={14} className="mr-1" />
              <span>{club.city}</span>
            </div>
          </div>
          
          {/* Açıklama */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {club.description}
          </p>
          
          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="flex justify-center text-indigo-600 mb-1">
                <UsersIcon size={16} />
              </div>
              <p className="text-xs text-gray-500">Üyeler</p>
              <p className="text-sm font-medium text-gray-800">{club.members || 120}+</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="flex justify-center text-indigo-600 mb-1">
                <CalendarIcon size={16} />
              </div>
              <p className="text-xs text-gray-500">Etkinlikler</p>
              <p className="text-sm font-medium text-gray-800">{club.events || 15}+</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="flex justify-center text-indigo-600 mb-1">
                <TrophyIcon size={16} />
              </div>
              <p className="text-xs text-gray-500">Ödüller</p>
              <p className="text-sm font-medium text-gray-800">{club.awards || 8}</p>
            </div>
          </div>
        </div>
        
        {/* Alt Kısım */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
            <span className="mr-2">Detayları Gör</span>
            <ArrowRightIcon size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}