// data/eventsData.ts
export interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // ISO format (e.g., "2025-04-12")
    location: string;
  }
  
  export const eventsData: Event[] = [
    {
      id: 1,
      title: "Tech Meetup 2025",
      description: "Yapay zeka ve büyük veri üzerine konuşmalar.",
      date: "2025-04-12",
      location: "İstanbul Teknik Üniversitesi",
    },
    {
      id: 1,
      title: "Tech Meetup 2025",
      description: "Yapay zeka ve büyük veri üzerine konuşmalar.",
      date: "2025-04-12",
      location: "İstanbul Teknik Üniversitesi",
    },
    {
      id: 2,
      title: "Siber Güvenlik Zirvesi",
      description: "En güncel tehditler ve savunma yöntemleri.",
      date: "2025-03-20",
      location: "ODTÜ",
    },
    {
      id: 3,
      title: "Mobil Uygulama Hackathon'u",
      description: "48 saatlik uygulama geliştirme yarışması.",
      date: "2025-04-20",
      location: "Boğaziçi Üniversitesi",
    },
  ];
  