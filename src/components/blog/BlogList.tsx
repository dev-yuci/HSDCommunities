'use client';

import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import FeaturedPostCard from './FeaturedPost';
import { BlogPost, currentFeaturedPost } from '@/lib/getMediumPosts';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/medium-posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Medium yazıları alınamadı:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

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

      {loading ? (
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
          {posts.length > 0 ? (
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
                  {posts.length} yazı
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {posts.map((post, index) => (
                  <BlogCard key={index} post={post} />
                ))}
              </div>
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
