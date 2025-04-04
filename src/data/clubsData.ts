export interface ClubData {
  id: number;
  name: string;
  university: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  memberCount: number;
  yearFounded: number;
  logo?: string;
  description: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  contactEmail?: string;
}

const clubsData: ClubData[] = [
  {
    id: 1,
    name: "HSD İTÜ",
    university: "İstanbul Teknik Üniversitesi",
    city: "İstanbul",
    location: {
      lat: 41.1055,
      lng: 29.0267
    },
    memberCount: 120,
    yearFounded: 2020,
    logo: "/logos/itu.png",
    description: "İTÜ Huawei Student Developers topluluğu, İTÜ öğrencileri tarafından kurulmuş, Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.itu.edu.tr",
    socialMedia: {
      instagram: "@hsditutechclub",
      twitter: "@hsditutechclub",
      linkedin: "hsd-itu"
    },
    contactEmail: "hsd@itu.edu.tr"
  },
  {
    id: 2,
    name: "HSD ODTÜ",
    university: "Orta Doğu Teknik Üniversitesi",
    city: "Ankara",
    location: {
      lat: 39.8919,
      lng: 32.7817
    },
    memberCount: 95,
    yearFounded: 2021,
    logo: "/logos/odtu.png",
    description: "ODTÜ öğrencileri tarafından kurulmuş, Huawei teknolojileri alanında çalışmalar yapan öğrenci topluluğu.",
    socialMedia: {
      instagram: "@hsdodtu",
      linkedin: "hsd-odtu"
    },
    contactEmail: "hsd@metu.edu.tr"
  },
  {
    id: 3,
    name: "HSD Ege",
    university: "Ege Üniversitesi",
    city: "İzmir",
    location: {
      lat: 38.4534,
      lng: 27.2134
    },
    memberCount: 78,
    yearFounded: 2021,
    logo: "/logos/ege.png",
    description: "Ege Üniversitesi'nde Huawei teknolojileri konusunda faaliyetler yürüten öğrenci kulübü.",
    socialMedia: {
      instagram: "@hsdege",
      linkedin: "hsd-ege"
    },
    contactEmail: "hsd@ege.edu.tr"
  },
  {
    id: 4,
    name: "HSD Bilkent",
    university: "Bilkent Üniversitesi",
    city: "Ankara",
    location: {
      lat: 39.8674,
      lng: 32.7486
    },
    memberCount: 85,
    yearFounded: 2020,
    logo: "/logos/bilkent.png",
    description: "Bilkent Üniversitesi'nde Huawei teknolojileri konusunda faaliyetler yürüten, atölye çalışmaları ve etkinlikler düzenleyen öğrenci kulübü.",
    website: "https://hsdbilkent.org",
    socialMedia: {
      instagram: "@hsdbilkent",
      twitter: "@hsdbilkent",
      linkedin: "hsd-bilkent"
    },
    contactEmail: "hsd@bilkent.edu.tr"
  },
  {
    id: 5,
    name: "HSD Boğaziçi",
    university: "Boğaziçi Üniversitesi",
    city: "İstanbul",
    location: {
      lat: 41.0855,
      lng: 29.0453
    },
    memberCount: 110,
    yearFounded: 2021,
    logo: "/logos/bogazici.png",
    description: "Boğaziçi Üniversitesi öğrencilerinin kurduğu, Huawei teknolojileri odaklı etkinlikler ve projeler geliştiren öğrenci kulübü.",
    website: "https://hsdbogazici.org",
    socialMedia: {
      instagram: "@hsdbogazici",
      linkedin: "hsd-bogazici"
    },
    contactEmail: "hsd@boun.edu.tr"
  },
  {
    id: 6,
    name: "HSD YTÜ",
    university: "Yıldız Teknik Üniversitesi",
    city: "İstanbul",
    location: {
      lat: 41.0258,
      lng: 28.8898
    },
    memberCount: 92,
    yearFounded: 2021,
    logo: "/logos/ytu.png",
    description: "YTÜ öğrencileri tarafından kurulan, Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren topluluk.",
    socialMedia: {
      instagram: "@hsdytu",
      linkedin: "hsd-ytu"
    },
    contactEmail: "hsd@ytu.edu.tr"
  },
  {
    id: 7,
    name: "HSD Ankara",
    university: "Ankara Üniversitesi",
    city: "Ankara",
    location: {
      lat: 39.9334,
      lng: 32.8597
    },
    memberCount: 65,
    yearFounded: 2022,
    logo: "/logos/ankara.png",
    description: "Ankara Üniversitesi'nde Huawei teknolojileri ve mobil uygulama geliştirme alanında çalışmalar yapan öğrenci topluluğu.",
    socialMedia: {
      instagram: "@hsdankara",
      linkedin: "hsd-ankara"
    },
    contactEmail: "hsd@ankara.edu.tr"
  },
  {
    id: 8,
    name: "HSD KTÜ",
    university: "Karadeniz Teknik Üniversitesi",
    city: "Trabzon",
    location: {
      lat: 41.0058,
      lng: 39.7717
    },
    memberCount: 55,
    yearFounded: 2022,
    logo: "/logos/ktu.png",
    description: "KTÜ öğrencilerinin kurduğu, Huawei teknolojileri üzerine çalışmalar yapan ve projeler geliştiren öğrenci kulübü.",
    socialMedia: {
      instagram: "@hsdktu",
      linkedin: "hsd-ktu"
    },
    contactEmail: "hsd@ktu.edu.tr"
  },
  {
    id: 9,
    name: "HSD Dokuz Eylül",
    university: "Dokuz Eylül Üniversitesi",
    city: "İzmir",
    location: {
      lat: 38.3637,
      lng: 27.1717
    },
    memberCount: 70,
    yearFounded: 2022,
    logo: "/logos/deu.png",
    description: "Dokuz Eylül Üniversitesi öğrencilerinin kurduğu, Huawei teknolojileri alanında etkinlikler düzenleyen öğrenci topluluğu.",
    socialMedia: {
      instagram: "@hsddeu",
      linkedin: "hsd-deu"
    },
    contactEmail: "hsd@deu.edu.tr"
  },
  {
    id: 10,
    name: "HSD Akdeniz",
    university: "Akdeniz Üniversitesi",
    city: "Antalya",
    location: {
      lat: 36.8969,
      lng: 30.6838
    },
    memberCount: 60,
    yearFounded: 2022,
    logo: "/logos/akdeniz.png",
    description: "Akdeniz Üniversitesi öğrencilerinin bir araya gelerek kurduğu, Huawei teknolojileri ve mobil uygulama geliştirme alanında projeler yürüten öğrenci topluluğu.",
    socialMedia: {
      instagram: "@hsdakdeniz",
      linkedin: "hsd-akdeniz"
    },
    contactEmail: "hsd@akdeniz.edu.tr"
  }
];

export default clubsData; 