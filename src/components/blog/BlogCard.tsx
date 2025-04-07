import React from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/getMediumPosts';

export default function BlogCard({ post }: { post: BlogPost }) {
  // Tarih formatını düzenle
  const publishDate = new Date(post.pubDate);
  const formattedDate = publishDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Renk çeşitliliği oluşturmak için rastgele renk seçimi
  const colors = [
    'from-blue-400 to-indigo-600',
    'from-indigo-400 to-purple-600',
    'from-purple-400 to-pink-600',
    'from-pink-400 to-red-600',
    'from-red-400 to-orange-600',
    'from-orange-400 to-amber-600',
    'from-amber-400 to-yellow-600',
    'from-emerald-400 to-teal-600',
    'from-teal-400 to-cyan-600',
    'from-cyan-400 to-blue-600'
  ];
  
  // Yazı ID'sine göre sabit bir renk ataması yapmak için
  const colorIndex = Math.abs(post.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  const gradientColor = colors[colorIndex];

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      {/* Görsel */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Renkli overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${gradientColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
        
        {/* Tarih ve okuma süresi etiketi */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readingTimeMinutes || 4} dk okuma
          </div>
        </div>
        
        {/* Yazar bilgisi */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
          <div className="font-medium truncate flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author}
          </div>
        </div>
      </div>
      
      {/* İçerik */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Tarih */}
        <div className="text-xs text-gray-500 mb-2">
          {formattedDate}
        </div>
        
        {/* Başlık */}
        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
        
        {/* Özet */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.contentSnippet}</p>
        
        {/* Devamını oku butonu */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer" 
            className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent hover:scale-105 transition-transform`}
          >
            Devamını Oku
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
