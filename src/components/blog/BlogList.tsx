'use client';

import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/lib/getMediumPosts';

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Yazılarımız</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
