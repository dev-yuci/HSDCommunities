import React from 'react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';

// Mock veri - gerçek uygulamada API'dan gelecektir
const communities = [
  {
    id: 1,
    name: "HSD İTÜ",
    memberCount: 125,
    description: "İstanbul Teknik Üniversitesi'nde Huawei teknolojileri üzerine çalışan öğrenci kulübü.",
    image: "/placeholder.png",
    color: "bg-red-500"
  },
  {
    id: 2,
    name: "HSD ODTÜ",
    memberCount: 98,
    description: "ODTÜ'de HMS Core ve HarmonyOS üzerine çalışmalar yapan öğrenci topluluğu.",
    image: "/placeholder.png",
    color: "bg-red-600"
  },
  {
    id: 3,
    name: "HSD Boğaziçi",
    memberCount: 78,
    description: "Boğaziçi Üniversitesi'nde Huawei Cloud ve AppGallery geliştirme odaklı öğrenci kulübü.",
    image: "/placeholder.png",
    color: "bg-red-700"
  },
  {
    id: 4,
    name: "HSD Bilkent",
    memberCount: 55,
    description: "Bilkent Üniversitesi'nde Huawei teknolojileri ve mobil uygulama geliştirme odaklı kulüp.",
    image: "/placeholder.png",
    color: "bg-red-800"
  },
  {
    id: 5,
    name: "HSD Ege",
    memberCount: 42,
    description: "Ege Üniversitesi'nde Huawei teknolojileri ve HMS Core eğitimleri düzenleyen topluluk.",
    image: "/placeholder.png",
    color: "bg-gray-800"
  },
  {
    id: 6,
    name: "HSD Hacettepe",
    memberCount: 67,
    description: "Hacettepe Üniversitesi'nde Huawei teknolojileri ve yapay zeka uygulamaları geliştiren kulüp.",
    image: "/placeholder.png",
    color: "bg-gray-700"
  }
];

export default function CommunitiesSection() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">HSD Üniversite Kulüpleri</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Türkiye'nin önde gelen üniversitelerindeki Huawei Student Developers kulüplerine katılın
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} hover className="h-full">
              <CardContent className="p-0">
                <div className={`h-3 ${community.color} rounded-t-xl`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white ${community.color}`}>
                      {community.name.substring(4, 6)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{community.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{community.memberCount} üye</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{community.description}</p>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm">Etkinlikler</Button>
                    <Button variant="primary" size="sm">Katıl</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="secondary">
            Tüm HSD Kulüplerini Keşfet
          </Button>
        </div>
      </div>
    </section>
  );
} 