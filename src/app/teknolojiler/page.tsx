import React from "react";
import Header from "@/components/layout/Header";
import TechnologiesList from "@/components/technologies/TechnologiesList";
import Footer from "@/components/layout/Footer";

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <TechnologiesList />
      </main>
      <Footer />
    </div>
  );
}
