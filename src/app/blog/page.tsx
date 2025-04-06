import React from "react";
import Header from "@/components/layout/Header";
import BlogList from "@/components/blog/BlogList";

export default function BlogPage() {
    return (
        <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <BlogList />
        </main>
        </div>
    );
}