'use client';

import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import FeaturedPostCard from './FeaturedPost';
import { BlogPost, currentFeaturedPost } from '@/lib/getMediumPosts';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const perPage = 6; // Bir sayfada gösterilecek yazı sayısı

  // İlk yükleme
  useEffect(() => {
    fetchPosts();
  }, []);

  // Ana veri yükleme fonksiyonu
  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await fetch('/api/medium-posts');
      const data = await res.json();
      setPosts(data);
      setTotalPosts(data.length);
      setHasMore(data.length > perPage * page);
    } catch (error) {
      console.error('Medium yazıları alınamadı:', error);
    } finally {
      setLoading(false);
    }
  }

  // Daha fazla yazı yükleme
  function loadMore() {
    setPage(prevPage => prevPage + 1);
    // Bu sadece sayfa sayısını artırıyor, tüm veriler zaten çekilmiş durumda
    setHasMore(totalPosts > perPage * (page + 1));
  }

  // Görüntülenecek mevcut gönderileri hesapla
  const displayedPosts = posts.slice(0, page * perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Bölümü */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Blog Yazılarımız</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Huawei Cloud teknolojileri, yazılım geliştirme ve cloud computing konularında uzman yazarlarımızın paylaşımları.
        </p>
      </div>
      
      {/* Öne Çıkan Yazı */}
      <div className="mb-14">
        <FeaturedPostCard post={currentFeaturedPost} />
      </div>

      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md h-96 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Blog Kartları */}
          {displayedPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold relative inline-block">
                  Tüm Yazılar
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                </h2>
                <span className="bg-blue-100 text-blue-700 text-sm px-4 py-1.5 rounded-full font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {totalPosts} yazı
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {displayedPosts.map((post, index) => (
                  <BlogCard key={post.id || index} post={post} />
                ))}
              </div>
              
              {/* Daha Fazla Yükle butonu */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        Daha Fazla Göster
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Henüz yazı bulunmuyor</h3>
              <p className="text-gray-500">Yazılar yüklenemedi veya henüz yayınlanmış bir yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
