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
    },
    {
      id: 6,
      title: "Bulut Teknolojileri Konferansı",
      description: "AWS, Azure ve Google Cloud platformlarının karşılaştırıldığı ve en iyi uygulamaların paylaşıldığı kapsamlı bir konferans. Bulut mimarisi, güvenlik ve maliyet optimizasyonu konularında derinlemesine bilgilendirmeler yapılacak. Sektör liderleri deneyimlerini paylaşacak.",
      date: "2025-01-15",
      location: "Yıldız Teknik Üniversitesi",
      category: "Konferans",
      organizer: "HSD YTÜ"
    },
    {
      id: 7,
      title: "Veri Bilimi Bootcamp",
      description: "Veri bilimi ve makine öğrenmesi alanında kapsamlı bir eğitim programı. Python, pandas, scikit-learn ve TensorFlow gibi araçlarla pratik uygulamalar yapacağız. Gerçek dünya veri setleri üzerinde çalışarak iş dünyasında kullanılabilir beceriler kazanacaksınız.",
      date: "2025-02-10",
      location: "Hacettepe Üniversitesi",
      category: "Workshop",
      organizer: "HSD Hacettepe"
    },
    {
      id: 8,
      title: "Blockchain ve Web3 Summit",
      description: "Blockchain teknolojilerinin geleceği, kripto paralar ve merkeziyetsiz uygulamaların tartışıldığı bir zirve. NFT'ler, DeFi ve DAO'lar hakkında güncel bilgiler paylaşılacak. Katılımcılar, alanında öncü girişimcilerle tanışma fırsatı bulacaklar.",
      date: "2025-03-05",
      location: "İstanbul Bilgi Üniversitesi",
      category: "Seminer",
      organizer: "HSD Bilgi"
    },
    {
      id: 9,
      title: "DevOps ve CI/CD Uygulamaları",
      description: "Modern yazılım geliştirme süreçlerinde DevOps metodolojileri ve sürekli entegrasyon/sürekli dağıtım (CI/CD) uygulamaları. Docker, Kubernetes, Jenkins ve GitLab CI gibi araçların kullanımı gösterilecek. Mikroservis mimarileri ve altyapı otomasyonu konuları da ele alınacak.",
      date: "2025-01-25",
      location: "Ege Üniversitesi",
      category: "Workshop",
      organizer: "HSD Ege"
    },
    {
      id: 10,
      title: "Oyun Geliştirme Hackathon",
      description: "72 saatlik yoğun bir oyun geliştirme maratonu. Unity, Unreal Engine veya kendi seçtiğiniz oyun motoruyla çalışabilirsiniz. Profesyonel oyun geliştiricileri mentörlük yapacak ve en iyi projelere ödüller verilecek. Tüm seviyelerden katılımcılar için uygundur.",
      date: "2025-02-20",
      location: "ODTÜ Teknokent",
      category: "Hackathon",
      organizer: "HSD Games"
    },
    {
      id: 11,
      title: "React ve Next.js İleri Seviye Atölyesi",
      description: "Modern web uygulamaları geliştirmek için React ve Next.js'in ileri seviye özelliklerini keşfedeceğiz. Server components, Suspense, ve yeni nesil React özelliklerini deneyimleyeceksiniz. Katılımcıların temel React bilgisine sahip olması önerilir.",
      date: "2025-08-25",
      location: "Marmara Üniversitesi",
      category: "Workshop",
      organizer: "HSD Marmara"
    },
    {
      id: 12,
      title: "Siber Güvenlik Bootcamp",
      description: "Temel siber güvenlik kavramlarından ileri seviye sızma testi tekniklerine kadar kapsamlı bir eğitim. Kali Linux, Metasploit ve diğer popüler güvenlik araçlarını kullanarak gerçek dünya senaryoları üzerinde çalışacaksınız. Etik hacker olmak isteyenler için mükemmel bir fırsat.",
      date: "2025-09-10",
      location: "Koç Üniversitesi",
      category: "Workshop",
      organizer: "HSD Koç"
    },
    {
      id: 13,
      title: "Yapay Zeka ve Görüntü İşleme Semineri",
      description: "Yapay zeka destekli görüntü işleme teknolojilerinin sağlık, güvenlik ve otomotiv sektörlerindeki uygulamaları. OpenCV, TensorFlow ve PyTorch gibi kütüphanelerle pratik örnekler gösterilecek. Son teknoloji yapay zeka modellerinin görüntü işlemedeki performansı karşılaştırılacak.",
      date: "2025-08-30",
      location: "İstanbul Teknik Üniversitesi",
      category: "Seminer",
      organizer: "HSD İTÜ"
    },
    {
      id: 14,
      title: "Mobil Uygulama Tasarım Prensipleri",
      description: "Kullanıcı deneyimini merkeze alan mobil uygulama tasarım prensipleri ve uygulamaları. iOS ve Android platformlarına özgü tasarım kılavuzları ve en iyi kullanıcı arayüzü pratikleri incelenecek. Figma kullanılarak interaktif prototip oluşturma çalışması yapılacak.",
      date: "2025-09-20",
      location: "Bahçeşehir Üniversitesi",
      category: "Workshop",
      organizer: "HSD Bahçeşehir"
    },
    {
      id: 15,
      title: "Açık Kaynak Yazılım Konferansı",
      description: "Açık kaynak yazılım ekosistemi, lisanslama, topluluk yönetimi ve açık kaynak iş modelleri hakkında kapsamlı bilgiler. Popüler açık kaynak projelerin geliştiricileri deneyimlerini paylaşacak. GitHub ve GitLab üzerinde etkin açık kaynak proje yönetimi uygulamaları gösterilecek.",
      date: "2025-10-15",
      location: "ODTÜ",
      category: "Konferans",
      organizer: "HSD ODTÜ"
    }
  ];
  