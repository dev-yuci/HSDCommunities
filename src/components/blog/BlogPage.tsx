'use client';

import React from "react";
import Header from "@/components/layout/Header";
import BlogList from "@/components/blog/BlogList";
import Footer from "@/components/layout/Footer";

export default function BlogPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
        <Header />
        
        {/* Hero Bölümü */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 rounded-l-full transform translate-x-1/3"></div>
                <div className="absolute left-0 bottom-0 h-64 w-64 bg-blue-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog ve Makaleler</h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Huawei Cloud, yapay zeka, yazılım geliştirme ve bulut bilişim alanında uzman yazarlarımızın değerli makaleleri ve teknoloji güncellemeleri.
                    </p>
                    <div className="inline-block">
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-full pl-4 pr-2 py-1">
                            <span>Son güncelleme:</span>
                            <span className="bg-blue-600 rounded-full px-3 py-1">
                                {new Date().toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'})}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Dekoratif dalga */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" fill="#fff" className="w-full">
                    <path d="M0,0V60H1440V0C1114,60,347,60,0,0Z" />
                </svg>
            </div>
        </div>
        
        {/* Blog Listesi */}
        <main className="flex-grow py-6">
            <BlogList />
        </main>
        
        <Footer />
        </div>
    );
} 