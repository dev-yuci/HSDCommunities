'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  const [featuredUrl, setFeaturedUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState('');

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

  // Medium link doğrulama
  function validateMediumUrl(url: string) {
    return /^https:\/\/medium\.com\/.+/.test(url);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFeaturedUrl(value);
    setIsValid(validateMediumUrl(value));
    setUpdateMessage('');
  }

  async function handleUpdateFeatured() {
    if (!isValid) return;
    setUpdating(true);
    setUpdateMessage('');
    try {
      const res = await fetch('/api/update-featured-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: featuredUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMessage('');
        setShowSuccess(true);
        setFeaturedUrl('');
        setIsValid(false);
        // Otomatik kaybolsun
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setUpdateMessage(data.error || 'Bir hata oluştu.');
      }
    } catch (err) {
      setUpdateMessage('Bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  }

  const filteredPosts = displayedPosts.filter(
    post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Öne Çıkan Yazıyı Güncelle Alanı */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {/* Medium icon */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 1043.63 592.71"><g><path d="M588.67 296.14c0 163.57-131.98 296.14-294.33 296.14S0 459.71 0 296.14 131.98 0 294.33 0s294.34 132.57 294.34 296.14z"/><ellipse cx="772.52" cy="296.14" rx="120.9" ry="296.14"/><path d="M1043.63 296.14c0 163.57-54.17 296.14-121.01 296.14s-121.01-132.57-121.01-296.14S855.78 0 922.62 0s121.01 132.57 121.01 296.14z"/></g></svg>
          </span>
          <input
            type="text"
            placeholder="Ör: https://medium.com/@kullanici/yazi-linki"
            value={featuredUrl}
            onChange={handleInputChange}
            className={`border rounded pl-10 pr-3 py-2 w-full transition focus:ring-2 ${
              isValid ? "border-green-500 focus:ring-green-200" : featuredUrl ? "border-red-400 focus:ring-red-100" : "border-gray-300"
            }`}
            disabled={updating}
          />
        </div>
        <button
          onClick={handleUpdateFeatured}
          disabled={!isValid || updating}
          className={`px-4 py-2 rounded transition font-medium ${
            isValid && !updating
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-300 text-white cursor-not-allowed"
          }`}
        >
          {updating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Güncelleniyor...
            </span>
          ) : (
            "Öne Çıkan Yazıyı Güncelle"
          )}
        </button>
        {updateMessage && (
          <span className={`text-sm ml-2 transition ${updateMessage.startsWith('✅') ? "text-green-600" : "text-red-600"}`}>
            {updateMessage}
          </span>
        )}
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow animate-fade-in mb-2 transition-all">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Öne çıkan yazı başarıyla güncellendi!</span>
        </div>
      )}

      {/* Öne Çıkan Yazı */}
      <div className="mb-14">
        <FeaturedPostCard />
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
              <div className="flex items-center justify-between mb-10 flex-col md:flex-row gap-4">
                <h2 className="text-2xl font-bold relative inline-block">
                  Tüm Yazılar
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                </h2>
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Yazı başlığı ile ara..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full rounded bg-blue-50 focus:bg-white border border-blue-200 focus:border-blue-400 outline-none transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredPosts.map((post, index) => (
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
