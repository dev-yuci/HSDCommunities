import React from 'react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Okulunda HSD kulübü kurmaya hazır mısın?</span>
          <span className="block text-blue-100 mt-1">Bugün başvur ve Huawei Student Developers liderlerine katıl.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <Button variant="primary" className="bg-blue-600 text-white hover:bg-blue-50 shadow-md hover:shadow-lg font-semibold">
            HSD Kulübü Kur
          </Button>
          <Button variant="outline" className="border-blue-200 text-white hover:bg-blue-700 hover:border-blue-200 font-semibold">
            Detaylı Bilgi
          </Button>
        </div>
      </div>
    </section>
  );
} 