import React from 'react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="bg-red-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Okulunda HSD kulübü kurmaya hazır mısın?</span>
          <span className="block text-red-100 mt-1">Bugün başvur ve Huawei Student Developers liderlerine katıl.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <Button variant="primary" className="bg-white text-red-600 hover:bg-red-50">
            HSD Kulübü Kur
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-red-500">
            Detaylı Bilgi
          </Button>
        </div>
      </div>
    </section>
  );
} 