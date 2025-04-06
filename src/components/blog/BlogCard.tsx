import React from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/getMediumPosts';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl shadow-md overflow-hidden bg-white hover:shadow-xl transition-all duration-200"
    >
      <Image
        src={post.thumbnail}
        alt={post.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{post.contentSnippet}</p>
        <div className="text-xs text-gray-500 mt-3">
          {post.author} · {new Date(post.pubDate).toLocaleDateString()} · 4 min read
        </div>
      </div>
    </a>
  );
}
