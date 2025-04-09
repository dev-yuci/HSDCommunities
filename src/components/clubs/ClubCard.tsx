'use client';

import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl shadow-xl p-6 hover:scale-105 hover:shadow-blue-500/30 transition-all duration-300 ease-in-out cursor-pointer h-full flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-wide">{club.name}</h3>
          <p className="text-md text-slate-400">{club.university}</p>
          <p className="text-sm text-slate-500 italic">{club.city}</p>
          <p className="mt-4 text-slate-300 text-sm leading-relaxed line-clamp-4">
            {club.description}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <div className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-md shadow-blue-400/20">
            <ArrowRightIcon size={20} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}