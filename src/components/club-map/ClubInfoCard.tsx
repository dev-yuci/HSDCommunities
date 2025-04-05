"use client";

import React from 'react';
import Button from '../ui/Button';
import type { ClubData } from '../../data/clubsData';

interface ClubInfoCardProps {
  club: ClubData;
  onClose: () => void;
}

const ClubInfoCard: React.FC<ClubInfoCardProps> = ({ club, onClose }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full min-h-[350px]">
      <div className="flex items-start mb-4">
        <div className="flex items-center space-x-3">
          {club.logo && (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              <img src={club.logo} alt={`${club.name} logo`} className="w-10 h-10 object-contain" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{club.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{club.university}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{club.memberCount} Üye</span>
        </div>
        
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{club.yearFounded} yılında kuruldu</span>
        </div>
        
        {club.contactEmail && (
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300 break-all">{club.contactEmail}</span>
          </div>
        )}
      </div>
      
      <div 
        className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-[80px] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <p>{club.description}</p>
      </div>
      
      <style jsx global>{`
        div[class*="overflow-y-auto"]::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="secondary"
          className="w-full text-sm group relative overflow-hidden transition-all duration-300"
        >
          <span className="relative z-10 flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 font-medium">
            Etkinlikler
            <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 fill-transparent stroke-current text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
        
        <Button 
          variant="outline"
          className="w-full text-sm border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
        >
          <span className="flex items-center justify-center">
            Katıl
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Button>
      </div>
      
      {club.socialMedia && (
        <div className="mt-4 flex justify-center space-x-4">
          {club.socialMedia.instagram && (
            <a href={`https://instagram.com/${club.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          )}
          {club.socialMedia.twitter && (
            <a href={`https://twitter.com/${club.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
          {club.socialMedia.linkedin && (
            <a href={`https://linkedin.com/company/${club.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubInfoCard; 