import React from 'react';
import Image from 'next/image';
import { FeaturedPost } from '@/lib/getMediumPosts';

interface FeaturedPostProps {
  post: FeaturedPost;
}

const TagBadge = ({ tag }: { tag: string }) => (
  <span className="inline-block bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium hover:bg-blue-100 transition-colors">
    {tag}
  </span>
);

const FeaturedPostCard: React.FC<FeaturedPostProps> = ({ post }) => {
  const { title, description, thumbnail, link, author, date, readingTime, tags, stats } = post;
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="md:flex">
        {/* Yazı görseli - sol taraf */}
        <div className="md:w-2/5 relative h-64 md:h-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-80 md:hidden"></div>
          <Image 
            src={thumbnail} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          
          {/* Mobil için başlık overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:hidden">
            <h2 className="text-white font-bold text-2xl mb-2">{title}</h2>
            <div className="flex items-center text-white text-sm gap-3">
              <span>{date}</span>
              <span>•</span>
              <span>{readingTime} dk okuma</span>
            </div>
          </div>
        </div>
        
        {/* İçerik - sağ taraf */}
        <div className="md:w-3/5 p-6 md:p-8">
          {/* "Öne Çıkan" etiketi */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs uppercase font-bold px-3 py-1 rounded-full tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Öne Çıkan
            </div>
            
            <div className="ml-auto flex items-center text-gray-500 text-sm">
              <span className="font-medium">{author}</span>
            </div>
          </div>
          
          {/* Başlık - desktop */}
          <h2 className="font-bold text-2xl md:text-3xl mb-3 leading-tight hidden md:block">{title}</h2>
          
          {/* Açıklama */}
          <p className="text-gray-600 mb-5">{description}</p>
          
          {/* Alt kısım */}
          <div className="flex flex-col gap-4">
            {/* Etiketler */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              {/* İstatistikler */}
              <div className="flex gap-4 text-gray-500 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {stats.likes}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {stats.comments}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {stats.shares}
                </div>
              </div>
              
              {/* Okuma butonu */}
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
              >
                Yazıyı Oku
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostCard; 