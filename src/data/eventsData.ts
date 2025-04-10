// data/eventsData.ts
export interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // ISO format (e.g., "2025-04-12")
    location: string;
    category?: string; // Kategori bilgisi eklendi
    organizer?: string; // Düzenleyen kulüp/organizasyon bilgisi
  }
  
  export const eventsData: Event[] = [
    {
      id: 1,
      title: "Tech Meetup 2025",
      description: "Yapay zeka ve büyük veri üzerine konuşmalar. En güncel teknolojilerin tartışıldığı, uzmanların bir araya geldiği bu buluşmada, teknoloji dünyasının geleceğine ışık tutulacak. Etkinliğimizde ağ kurma fırsatları ve interaktif workshop'lar da yer alacak.",
      date: "2025-04-12",
      location: "İstanbul Teknik Üniversitesi",
      category: "Meetup",
      organizer: "HSD İTÜ"
    },
    {
      id: 2,
      title: "Siber Güvenlik Zirvesi",
      description: "En güncel tehditler ve savunma yöntemleri. Siber güvenlik uzmanları, etik hackerlar ve güvenlik araştırmacılarının katılacağı bu zirve, kurumsal ve bireysel siber güvenlik stratejilerini ele alacak. Katılımcılar, pratik savunma teknikleri öğrenme şansı bulacaklar.",
      date: "2025-03-20",
      location: "ODTÜ",
      category: "Konferans",
      organizer: "HSD ODTÜ"
    },
    {
      id: 3,
      title: "Mobil Uygulama Hackathon'u",
      description: "48 saatlik uygulama geliştirme yarışması. Yazılım geliştiriciler, tasarımcılar ve ürün yöneticilerinden oluşan takımlar, yenilikçi mobil uygulamalar geliştirmek için bir araya gelecek. Kazanan takımlara ödüller ve mentorluk fırsatları sunulacak.",
      date: "2025-04-20",
      location: "Boğaziçi Üniversitesi",
      category: "Hackathon",
      organizer: "HSD Boğaziçi"
    },
    {
      id: 4,
      title: "Frontend Geliştirme Workshop'u",
      description: "Modern web teknolojileri ve frontend geliştirme pratikleri üzerine uygulamalı workshop. React, Vue ve Angular gibi popüler framework'ler üzerinde çalışacağız. Katılımcıların temel JavaScript bilgisine sahip olması beklenmektedir.",
      date: "2024-12-15",
      location: "Bilkent Üniversitesi",
      category: "Workshop",
      organizer: "HSD Bilkent"
    },
    {
      id: 5,
      title: "Yapay Zeka ve Etik Paneli",
      description: "Yapay zeka teknolojilerinin etik boyutlarının tartışılacağı bir panel. Akademisyenler, sektör liderleri ve etik uzmanları bir araya gelerek yapay zekanın toplumsal etkilerini değerlendirecek. Katılımcılar soru sorma ve tartışmaya katılma fırsatı bulacaklar.",
      date: "2024-11-05",
      location: "Ankara Üniversitesi",
      category: "Panel",
      organizer: "HSD Ankara"
    }
  ];
  