"use client";

import React from 'react';
import TurkeyClubMap from './TurkeyClubMap';

interface ClubMapSectionProps {
  title?: string;
  description?: string;
}

const ClubMapSection: React.FC<ClubMapSectionProps> = ({
  title = "Türkiye'deki HSD Toplulukları",
  description = "Haritada Huawei Student Developers topluluklarının bulunduğu üniversiteleri görebilir, topluluklar hakkında detaylı bilgiye erişebilirsiniz."
}) => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 text-lg font-bold tracking-wider uppercase relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-red-300 after:rounded-full">
            Üniversite Kulüpleri
          </span>
          <h2 className="mt-4 text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        
        <div className="mb-16">
          <TurkeyClubMap />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <div className="w-5 h-5 rounded-full bg-red-500 shadow-sm shadow-red-300 dark:shadow-red-900/30"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Üniversite Kulübü</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">HSD</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-red-500 dark:text-red-400">56</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Aktif Topluluk</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">Üniversitede</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-red-500 dark:text-red-400">20</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Şehir</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">Türkiye'de</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <span className="text-md font-bold text-red-500 dark:text-red-400">3.6K+</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Toplam Üye</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">Öğrenci</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubMapSection; 