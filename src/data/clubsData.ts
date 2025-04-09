export interface ClubData {
  id: number;
  name: string;
  university: string;
  city: string;
  area: string;
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
    name: "HSD Fırat Üniversitesi",
    university: "Fırat Üniversitesi",
    city: "Elazığ",
    area: "Doğu Anadolu",
    location: {
      lat: 38.6749,
      lng: 39.2232
    },
    logo: "/logos/firatuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.firat.edu.tr",
    socialMedia: {
      instagram: "@hsdfiratuniversitesi",
      linkedin: "hsd-firatuniversitesi"
    },
    contactEmail: "hsd@firatuniversitesi.edu.tr",
    memberCount: 69,
    yearFounded: 2022
  },
  {
    id: 2,
    name: "HSD Gazi Üniversitesi",
    university: "Gazi Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.9402,
      lng: 32.8215
    },
    logo: "/logos/gaziuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.gazi.edu.tr",
    socialMedia: {
      instagram: "@hsdgaziuniversitesi",
      linkedin: "hsd-gaziuniversitesi"
    },
    contactEmail: "hsd@gaziuniversitesi.edu.tr",
    memberCount: 98,
    yearFounded: 2021
  },
  {
    id: 3,
    name: "HSD Beykent Üniversitesi",
    university: "Beykent Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0677,
      lng: 28.9983
    },
    logo: "/logos/beykentuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.beykentuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbeykentuniversitesi",
      linkedin: "hsd-beykentuniversitesi"
    },
    contactEmail: "hsd@beykentuniversitesi.edu.tr",
    memberCount: 78,
    yearFounded: 2023
  },
  {
    id: 4,
    name: "HSD Karadeniz Teknik Üniversitesi",
    university: "Karadeniz Teknik Üniversitesi",
    city: "Trabzon",
    area: "Karadeniz",
    location: {
      lat: 41.005,
      lng: 39.7225
    },
    logo: "/logos/karadenizteknikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.karadenizteknikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkaradenizteknikuniversitesi",
      linkedin: "hsd-karadenizteknikuniversitesi"
    },
    contactEmail: "hsd@karadenizteknikuniversitesi.edu.tr",
    memberCount: 58,
    yearFounded: 2020
  },
  {
    id: 5,
    name: "HSD Yalova Üniversitesi",
    university: "Yalova Üniversitesi",
    city: "Yalova",
    area: "Marmara",
    location: {
      lat: 40.6517,
      lng: 29.2195
    },
    logo: "/logos/yalovauniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.yalovauniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdyalovauniversitesi",
      linkedin: "hsd-yalovauniversitesi"
    },
    contactEmail: "hsd@yalovauniversitesi.edu.tr",
    memberCount: 89,
    yearFounded: 2020
  },
  {
    id: 6,
    name: "HSD Artvin Çoruh üniversitesi",
    university: "Artvin Çoruh üniversitesi",
    city: "Artvin",
    area: "Karadeniz",
    location: {
      lat: 41.1873,
      lng: 41.8188
    },
    logo: "/logos/artvincoruhuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.artvincoruhuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdartvincoruhuniversitesi",
      linkedin: "hsd-artvincoruhuniversitesi"
    },
    contactEmail: "hsd@artvincoruhuniversitesi.edu.tr",
    memberCount: 67,
    yearFounded: 2022
  },
  {
    id: 7,
    name: "HSD Kıbrıs Doğu Akdeniz Üniversitesi",
    university: "Kıbrıs Doğu Akdeniz Üniversitesi",
    city: "Gazimağusa, KKTC",
    area: "Kuzey Kıbrıs",
    location: {
      lat: 35.1457,
      lng: 33.9126
    },
    logo: "/logos/kibrisdoguakdenizuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.kibrisdoguakdenizuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkibrisdoguakdenizuniversitesi",
      linkedin: "hsd-kibrisdoguakdenizuniversitesi"
    },
    contactEmail: "hsd@kibrisdoguakdenizuniversitesi.edu.tr",
    memberCount: 118,
    yearFounded: 2023
  },
  {
    id: 8,
    name: "HSD YTÜ",
    university: "YTÜ",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0280,
      lng: 28.8898
    },
    logo: "/logos/ytu.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.ytu.edu.tr",
    socialMedia: {
      instagram: "@hsdytu",
      linkedin: "hsd-ytu"
    },
    contactEmail: "hsd@ytu.edu.tr",
    memberCount: 84,
    yearFounded: 2020
  },
  {
    id: 9,
    name: "HSD Konya Selçuk Üniversitesi",
    university: "Konya Selçuk Üniversitesi",
    city: "Konya",
    area: "İç Anadolu",
    location: {
      lat: 38.0156,
      lng: 32.5084
    },
    logo: "/logos/konyaselcukuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.konyaselcukuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkonyaselcukuniversitesi",
      linkedin: "hsd-konyaselcukuniversitesi"
    },
    contactEmail: "hsd@konyaselcukuniversitesi.edu.tr",
    memberCount: 120,
    yearFounded: 2022
  },
  {
    id: 10,
    name: "HSD Marmara Üniversitesi",
    university: "Marmara Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 40.9862,
      lng: 29.0518
    },
    logo: "/logos/marmarauniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.marmarauniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdmarmarauniversitesi",
      linkedin: "hsd-marmarauniversitesi"
    },
    contactEmail: "hsd@marmarauniversitesi.edu.tr",
    memberCount: 89,
    yearFounded: 2021
  },
  {
    id: 11,
    name: "HSD İYTE",
    university: "İYTE",
    city: "İzmir",
    area: "Ege",
    location: {
      lat: 38.3213,
      lng: 26.6392
    },
    logo: "/logos/iyte.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.iyte.edu.tr",
    socialMedia: {
      instagram: "@hsdiyte",
      linkedin: "hsd-iyte"
    },
    contactEmail: "hsd@iyte.edu.tr",
    memberCount: 90,
    yearFounded: 2020
  },
  {
    id: 12,
    name: "HSD Kütahya Dumlupınar Üniversitesi",
    university: "Kütahya Dumlupınar Üniversitesi",
    city: "Kütahya",
    area: "Ege",
    location: {
      lat: 39.4104,
      lng: 29.9945
    },
    logo: "/logos/kutahyadumlupinaruniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.kutahyadumlupinaruniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkutahyadumlupinaruniversitesi",
      linkedin: "hsd-kutahyadumlupinaruniversitesi"
    },
    contactEmail: "hsd@kutahyadumlupinaruniversitesi.edu.tr",
    memberCount: 86,
    yearFounded: 2023
  },
  {
    id: 13,
    name: "HSD Bursa Uludağ Üniversitesi",
    university: "Bursa Uludağ Üniversitesi",
    city: "Bursa",
    area: "Marmara",
    location: {
      lat: 40.2306,
      lng: 28.8610
    },
    logo: "/logos/bursauludaguniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.bursauludaguniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbursauludaguniversitesi",
      linkedin: "hsd-bursauludaguniversitesi"
    },
    contactEmail: "hsd@bursauludaguniversitesi.edu.tr",
    memberCount: 60,
    yearFounded: 2022
  },
  {
    id: 14,
    name: "HSD MEF",
    university: "MEF",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0969,
      lng: 29.0256
    },
    logo: "/logos/mef.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.mef.edu.tr",
    socialMedia: {
      instagram: "@hsdmef",
      linkedin: "hsd-mef"
    },
    contactEmail: "hsd@mef.edu.tr",
    memberCount: 61,
    yearFounded: 2021
  },
  {
    id: 15,
    name: "HSD Muğla Sıtkı Koçman Üniversitesi",
    university: "Muğla Sıtkı Koçman Üniversitesi",
    city: "Muğla",
    area: "Ege",
    location: {
      lat: 37.1696,
      lng: 28.3733
    },
    logo: "/logos/muglasitkikocmanuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.muglasitkikocmanuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdmuglasitkikocmanuniversitesi",
      linkedin: "hsd-muglasitkikocmanuniversitesi"
    },
    contactEmail: "hsd@muglasitkikocmanuniversitesi.edu.tr",
    memberCount: 58,
    yearFounded: 2020
  },
  {
    id: 16,
    name: "HSD AGÜ",
    university: "AGÜ",
    city: "Kayseri",
    area: "İç Anadolu",
    location: {
      lat: 38.7333,
      lng: 35.4833
    },
    logo: "/logos/agu.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.agu.edu.tr",
    socialMedia: {
      instagram: "@hsdagu",
      linkedin: "hsd-agu"
    },
    contactEmail: "hsd@agu.edu.tr",
    memberCount: 89,
    yearFounded: 2021
  },
  {
    id: 17,
    name: "HSD Eskişehir Osmangazi Ünveristesi",
    university: "Eskişehir Osmangazi Ünveristesi",
    city: "Eskişehir",
    area: "İç Anadolu",
    location: {
      lat: 39.7477,
      lng: 30.4788
    },
    logo: "/logos/eskisehirosmangaziunveristesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.eskisehirosmangaziunveristesi.edu.tr",
    socialMedia: {
      instagram: "@hsdeskisehirosmangaziunveristesi",
      linkedin: "hsd-eskisehirosmangaziunveristesi"
    },
    contactEmail: "hsd@eskisehirosmangaziunveristesi.edu.tr",
    memberCount: 61,
    yearFounded: 2021
  },
  {
    id: 18,
    name: "HSD İTÜ",
    university: "İTÜ",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.1054,
      lng: 29.0245
    },
    logo: "/logos/itu.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.itu.edu.tr",
    socialMedia: {
      instagram: "@hsditu",
      linkedin: "hsd-itu"
    },
    contactEmail: "hsd@itu.edu.tr",
    memberCount: 110,
    yearFounded: 2022
  },
  {
    id: 19,
    name: "HSD TED Üniversitesi",
    university: "TED Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.9250,
      lng: 32.8344
    },
    logo: "/logos/teduniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.teduniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdteduniversitesi",
      linkedin: "hsd-teduniversitesi"
    },
    contactEmail: "hsd@teduniversitesi.edu.tr",
    memberCount: 119,
    yearFounded: 2020
  },
  {
    id: 20,
    name: "HSD Başkent Üniversitesi",
    university: "Başkent Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.9154,
      lng: 32.8142
    },
    logo: "/logos/baskentuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.baskentuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbaskentuniversitesi",
      linkedin: "hsd-baskentuniversitesi"
    },
    contactEmail: "hsd@baskentuniversitesi.edu.tr",
    memberCount: 104,
    yearFounded: 2023
  },
  {
    id: 21,
    name: "HSD Hacettepe Üniversitesi",
    university: "Hacettepe Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.8676,
      lng: 32.7348
    },
    logo: "/logos/hacettepeuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.hacettepeuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdhacettepeuniversitesi",
      linkedin: "hsd-hacettepeuniversitesi"
    },
    contactEmail: "hsd@hacettepeuniversitesi.edu.tr",
    memberCount: 99,
    yearFounded: 2020
  },
  {
    id: 22,
    name: "HSD Gebze Teknik Üniversitesi",
    university: "Gebze Teknik Üniversitesi",
    city: "Kocaeli",
    area: "Marmara",
    location: {
      lat: 40.7930,
      lng: 29.4511
    },
    logo: "/logos/gebzeteknikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.gebzeteknikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdgebzeteknikuniversitesi",
      linkedin: "hsd-gebzeteknikuniversitesi"
    },
    contactEmail: "hsd@gebzeteknikuniversitesi.edu.tr",
    memberCount: 98,
    yearFounded: 2023
  },
  {
    id: 23,
    name: "HSD Bandırma Onyedi Eylül Üniversitesi",
    university: "Bandırma Onyedi Eylül Üniversitesi",
    city: "Balıkesir",
    area: "Marmara",
    location: {
      lat: 40.3555,
      lng: 27.9761
    },
    logo: "/logos/bandirmaonyedieyluluniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.bandirmaonyedieyluluniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbandirmaonyedieyluluniversitesi",
      linkedin: "hsd-bandirmaonyedieyluluniversitesi"
    },
    contactEmail: "hsd@bandirmaonyedieyluluniversitesi.edu.tr",
    memberCount: 82,
    yearFounded: 2021
  },
  {
    id: 24,
    name: "HSD Yaşar Üniversitesi",
    university: "Yaşar Üniversitesi",
    city: "İzmir",
    area: "Ege",
    location: {
      lat: 38.4627,
      lng: 27.2144
    },
    logo: "/logos/yasaruniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.yasaruniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdyasaruniversitesi",
      linkedin: "hsd-yasaruniversitesi"
    },
    contactEmail: "hsd@yasaruniversitesi.edu.tr",
    memberCount: 109,
    yearFounded: 2020
  },
  {
    id: 25,
    name: "HSD Karabük Üniversitesi",
    university: "Karabük Üniversitesi",
    city: "Karabük",
    area: "Karadeniz",
    location: {
      lat: 41.2101,
      lng: 32.6227
    },
    logo: "/logos/karabukuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.karabukuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkarabukuniversitesi",
      linkedin: "hsd-karabukuniversitesi"
    },
    contactEmail: "hsd@karabukuniversitesi.edu.tr",
    memberCount: 50,
    yearFounded: 2023
  },
  {
    id: 26,
    name: "HSD Nevşehir Hacı Bektaş Veli Üniversitesi",
    university: "Nevşehir Hacı Bektaş Veli Üniversitesi",
    city: "Nevşehir",
    area: "İç Anadolu",
    location: {
      lat: 38.6938,
      lng: 34.6857
    },
    logo: "/logos/nevsehirhacibektasveliuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.nevsehirhacibektasveliuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdnevsehirhacibektasveliuniversitesi",
      linkedin: "hsd-nevsehirhacibektasveliuniversitesi"
    },
    contactEmail: "hsd@nevsehirhacibektasveliuniversitesi.edu.tr",
    memberCount: 61,
    yearFounded: 2022
  },
  {
    id: 27,
    name: "HSD Atatürk Üniversitesi",
    university: "Atatürk Üniversitesi",
    city: "Erzurum",
    area: "Doğu Anadolu",
    location: {
      lat: 39.9077,
      lng: 41.2419
    },
    logo: "/logos/ataturkuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.ataturkuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdataturkuniversitesi",
      linkedin: "hsd-ataturkuniversitesi"
    },
    contactEmail: "hsd@ataturkuniversitesi.edu.tr",
    memberCount: 53,
    yearFounded: 2021
  },
  {
    id: 28,
    name: "HSD Yeditepe Üniversitesi",
    university: "Yeditepe Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 40.9717,
      lng: 29.1515
    },
    logo: "/logos/yeditepeuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.yeditepeuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdyeditepeuniversitesi",
      linkedin: "hsd-yeditepeuniversitesi"
    },
    contactEmail: "hsd@yeditepeuniversitesi.edu.tr",
    memberCount: 86,
    yearFounded: 2023
  },
  {
    id: 29,
    name: "HSD İskenderun Teknik Üniversitesi",
    university: "İskenderun Teknik Üniversitesi",
    city: "Hatay",
    area: "Akdeniz",
    location: {
      lat: 36.7072,
      lng: 36.2067
    },
    logo: "/logos/iskenderunteknikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.iskenderunteknikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdiskenderunteknikuniversitesi",
      linkedin: "hsd-iskenderunteknikuniversitesi"
    },
    contactEmail: "hsd@iskenderunteknikuniversitesi.edu.tr",
    memberCount: 109,
    yearFounded: 2022
  },
  {
    id: 30,
    name: "HSD Kayseri Üniversitesi",
    university: "Kayseri Üniversitesi",
    city: "Kayseri",
    area: "İç Anadolu",
    location: {
      lat: 38.7205,
      lng: 35.4826
    },
    logo: "/logos/kayseriuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.kayseriuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkayseriuniversitesi",
      linkedin: "hsd-kayseriuniversitesi"
    },
    contactEmail: "hsd@kayseriuniversitesi.edu.tr",
    memberCount: 85,
    yearFounded: 2020
  },
  {
    id: 31,
    name: "HSD Bursa Teknik Üniversitesi",
    university: "Bursa Teknik Üniversitesi",
    city: "Bursa",
    area: "Marmara",
    location: {
      lat: 40.2339,
      lng: 29.0094
    },
    logo: "/logos/bursateknikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.bursateknikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbursateknikuniversitesi",
      linkedin: "hsd-bursateknikuniversitesi"
    },
    contactEmail: "hsd@bursateknikuniversitesi.edu.tr",
    memberCount: 76,
    yearFounded: 2021
  },
  {
    id: 32,
    name: "HSD Malatya İnönü Üniversitesi",
    university: "Malatya İnönü Üniversitesi",
    city: "Malatya",
    area: "Doğu Anadolu",
    location: {
      lat: 38.3185,
      lng: 38.4358
    },
    logo: "/logos/malatyainonuuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.malatyainonuuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdmalatyainonuuniversitesi",
      linkedin: "hsd-malatyainonuuniversitesi"
    },
    contactEmail: "hsd@malatyainonuuniversitesi.edu.tr",
    memberCount: 100,
    yearFounded: 2022
  },
  {
    id: 33,
    name: "HSD İstanbul Bilgi Üniversitesi",
    university: "İstanbul Bilgi Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0418,
      lng: 28.9550
    },
    logo: "/logos/istanbulbilgiuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.istanbulbilgiuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdistanbulbilgiuniversitesi",
      linkedin: "hsd-istanbulbilgiuniversitesi"
    },
    contactEmail: "hsd@istanbulbilgiuniversitesi.edu.tr",
    memberCount: 71,
    yearFounded: 2023
  },
  {
    id: 34,
    name: "HSD Dokuz Eylül Üniversitesi",
    university: "Dokuz Eylül Üniversitesi",
    city: "İzmir",
    area: "Ege",
    location: {
      lat: 38.3898,
      lng: 27.0365
    },
    logo: "/logos/dokuzeyluluniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.dokuzeyluluniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsddokuzeyluluniversitesi",
      linkedin: "hsd-dokuzeyluluniversitesi"
    },
    contactEmail: "hsd@dokuzeyluluniversitesi.edu.tr",
    memberCount: 89,
    yearFounded: 2020
  },
  {
    id: 35,
    name: "HSD Manisa Celal Bayar Üniversitesi",
    university: "Manisa Celal Bayar Üniversitesi",
    city: "Manisa",
    area: "Ege",
    location: {
      lat: 38.6196,
      lng: 27.4289
    },
    logo: "/logos/manisacelalbayaruniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.manisacelalbayaruniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdmanisacelalbayaruniversitesi",
      linkedin: "hsd-manisacelalbayaruniversitesi"
    },
    contactEmail: "hsd@manisacelalbayaruniversitesi.edu.tr",
    memberCount: 65,
    yearFounded: 2020
  },
  {
    id: 36,
    name: "HSD Bogazici Universitesi",
    university: "Bogazici Universitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0850,
      lng: 29.0514
    },
    logo: "/logos/bogaziciuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.bogaziciuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbogaziciuniversitesi",
      linkedin: "hsd-bogaziciuniversitesi"
    },
    contactEmail: "hsd@bogaziciuniversitesi.edu.tr",
    memberCount: 80,
    yearFounded: 2020
  },
  {
    id: 37,
    name: "HSD Işık Üniversitesi",
    university: "Işık Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.1066,
      lng: 29.0373
    },
    logo: "/logos/isikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.isikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdisikuniversitesi",
      linkedin: "hsd-isikuniversitesi"
    },
    contactEmail: "hsd@isikuniversitesi.edu.tr",
    memberCount: 61,
    yearFounded: 2023
  },
  {
    id: 38,
    name: "HSD Bahçeşehir Üniversitesi",
    university: "Bahçeşehir Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0419,
      lng: 28.9726
    },
    logo: "/logos/bahcesehiruniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.bahcesehiruniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdbahcesehiruniversitesi",
      linkedin: "hsd-bahcesehiruniversitesi"
    },
    contactEmail: "hsd@bahcesehiruniversitesi.edu.tr",
    memberCount: 58,
    yearFounded: 2021
  },
  {
    id: 39,
    name: "HSD Necmettin Erbakan Üniversitesi ",
    university: "Necmettin Erbakan Üniversitesi ",
    city: "Konya",
    area: "Akdeniz",
    location: {
      lat: 37.8846,
      lng: 32.4834
    },
    logo: "/logos/necmettinerbakanuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.necmettinerbakanuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdnecmettinerbakanuniversitesi",
      linkedin: "hsd-necmettinerbakanuniversitesi"
    },
    contactEmail: "hsd@necmettinerbakanuniversitesi.edu.tr",
    memberCount: 70,
    yearFounded: 2020
  },
  {
    id: 40,
    name: "HSD Acıbadem Mehmet Ali Aydınlar Üniversitesi",
    university: "Acıbadem Mehmet Ali Aydınlar Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0015,
      lng: 29.1308
    },
    logo: "/logos/acibademmehmetaliaydinlaruniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.acibademmehmetaliaydinlaruniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdacibademmehmetaliaydinlaruniversitesi",
      linkedin: "hsd-acibademmehmetaliaydinlaruniversitesi"
    },
    contactEmail: "hsd@acibademmehmetaliaydinlaruniversitesi.edu.tr",
    memberCount: 61,
    yearFounded: 2021
  },
  {
    id: 41,
    name: "HSD İstanbul Aydın Üniversitesi",
    university: "İstanbul Aydın Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0201,
      lng: 28.7878
    },
    logo: "/logos/istanbulaydinuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.istanbulaydinuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdistanbulaydinuniversitesi",
      linkedin: "hsd-istanbulaydinuniversitesi"
    },
    contactEmail: "hsd@istanbulaydinuniversitesi.edu.tr",
    memberCount: 77,
    yearFounded: 2021
  },
  {
    id: 42,
    name: "HSD Süleyman Demirel Üniversitesi",
    university: "Süleyman Demirel Üniversitesi",
    city: "Isparta",
    area: "Akdeniz",
    location: {
      lat: 37.8746,
      lng: 30.5256
    },
    logo: "/logos/suleymandemireluniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.suleymandemireluniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdsuleymandemireluniversitesi",
      linkedin: "hsd-suleymandemireluniversitesi"
    },
    contactEmail: "hsd@suleymandemireluniversitesi.edu.tr",
    memberCount: 55,
    yearFounded: 2022
  },
  {
    id: 43,
    name: "HSD Tekirdağ Namık Kemal Üniversitesi",
    university: "Tekirdağ Namık Kemal Üniversitesi",
    city: "Tekirdağ",
    area: "Marmara",
    location: {
      lat: 40.9954,
      lng: 27.5554
    },
    logo: "/logos/tekirdagnamikkemaluniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.tekirdagnamikkemaluniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdtekirdagnamikkemaluniversitesi",
      linkedin: "hsd-tekirdagnamikkemaluniversitesi"
    },
    contactEmail: "hsd@tekirdagnamikkemaluniversitesi.edu.tr",
    memberCount: 86,
    yearFounded: 2023
  },
  {
    id: 44,
    name: "HSD Mersin Üniversitesi",
    university: "Mersin Üniversitesi",
    city: "Mersin",
    area: "Akdeniz",
    location: {
      lat: 36.8121,
      lng: 34.5371
    },
    logo: "/logos/mersinuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.mersinuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdmersinuniversitesi",
      linkedin: "hsd-mersinuniversitesi"
    },
    contactEmail: "hsd@mersinuniversitesi.edu.tr",
    memberCount: 89,
    yearFounded: 2020
  },
  {
    id: 45,
    name: "HSD Kadir Has üniversitesi",
    university: "Kadir Has üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 41.0207,
      lng: 28.9565
    },
    logo: "/logos/kadirhasuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.kadirhasuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkadirhasuniversitesi",
      linkedin: "hsd-kadirhasuniversitesi"
    },
    contactEmail: "hsd@kadirhasuniversitesi.edu.tr",
    memberCount: 74,
    yearFounded: 2021
  },
  {
    id: 46,
    name: "HSD Ostim Teknik Üniversitesi",
    university: "Ostim Teknik Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.9704,
      lng: 32.7462
    },
    logo: "/logos/ostimteknikuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.ostimteknikuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdostimteknikuniversitesi",
      linkedin: "hsd-ostimteknikuniversitesi"
    },
    contactEmail: "hsd@ostimteknikuniversitesi.edu.tr",
    memberCount: 98,
    yearFounded: 2022
  },
  {
    id: 47,
    name: "HSD Erciyes Universitesi",
    university: "Erciyes Universitesi",
    city: "Kayseri",
    area: "İç Anadolu",
    location: {
      lat: 38.7022,
      lng: 35.5359
    },
    logo: "/logos/erciyesuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.erciyesuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsderciyesuniversitesi",
      linkedin: "hsd-erciyesuniversitesi"
    },
    contactEmail: "hsd@erciyesuniversitesi.edu.tr",
    memberCount: 97,
    yearFounded: 2021
  },
  {
    id: 48,
    name: "HSD Zonguldak Bülent Ecevit Üniversitesi",
    university: "Zonguldak Bülent Ecevit Üniversitesi",
    city: "Zonguldak",
    area: "Karadeniz",
    location: {
      lat: 41.4481,
      lng: 31.7790
    },
    logo: "/logos/zonguldakbulentecevituniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.zonguldakbulentecevituniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdzonguldakbulentecevituniversitesi",
      linkedin: "hsd-zonguldakbulentecevituniversitesi"
    },
    contactEmail: "hsd@zonguldakbulentecevituniversitesi.edu.tr",
    memberCount: 92,
    yearFounded: 2023
  },
  {
    id: 49,
    name: "HSD Ege Üniversitesi",
    university: "Ege Üniversitesi",
    city: "İzmir",
    area: "Ege",
    location: {
      lat: 38.4564,
      lng: 27.2061
    },
    logo: "/logos/egeuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.egeuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdegeuniversitesi",
      linkedin: "hsd-egeuniversitesi"
    },
    contactEmail: "hsd@egeuniversitesi.edu.tr",
    memberCount: 107,
    yearFounded: 2021
  },
  {
    id: 50,
    name: "HSD Hasan Kalyoncu Üniversitesi",
    university: "Hasan Kalyoncu Üniversitesi",
    city: "Gaziantep",
    area: "Güneydoğu Anadolu",
    location: {
      lat: 37.1365,
      lng: 37.3705
    },
    logo: "/logos/hasankalyoncuuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.hasankalyoncuuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdhasankalyoncuuniversitesi",
      linkedin: "hsd-hasankalyoncuuniversitesi"
    },
    contactEmail: "hsd@hasankalyoncuuniversitesi.edu.tr",
    memberCount: 75,
    yearFounded: 2022
  },
  {
    id: 51,
    name: "HSD Ankara Üniversitesi",
    university: "Ankara Üniversitesi",
    city: "Ankara",
    area: "İç Anadolu",
    location: {
      lat: 39.9430,
      lng: 32.8541
    },
    logo: "/logos/ankarauniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.ankarauniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdankarauniversitesi",
      linkedin: "hsd-ankarauniversitesi"
    },
    contactEmail: "hsd@ankarauniversitesi.edu.tr",
    memberCount: 66,
    yearFounded: 2023
  },
  {
    id: 52,
    name: "HSD Akdeniz Üniversitesi",
    university: "Akdeniz Üniversitesi",
    city: "Antalya",
    area: "Akdeniz",
    location: {
      lat: 36.8969,
      lng: 30.6838
    },
    logo: "/logos/akdenizuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.akdenizuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdakdenizuniversitesi",
      linkedin: "hsd-akdenizuniversitesi"
    },
    contactEmail: "hsd@akdenizuniversitesi.edu.tr",
    memberCount: 107,
    yearFounded: 2022
  },
  {
    id: 53,
    name: "HSD Sakarya Üniversitesi",
    university: "Sakarya Üniversitesi",
    city: "Sakarya",
    area: "Marmara",
    location: {
      lat: 40.7408,
      lng: 30.3342
    },
    logo: "/logos/sakaryauniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.sakaryauniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdsakaryauniversitesi",
      linkedin: "hsd-sakaryauniversitesi"
    },
    contactEmail: "hsd@sakaryauniversitesi.edu.tr",
    memberCount: 63,
    yearFounded: 2020
  },
  {
    id: 54,
    name: "HSD İzmir Ekonomi Üniversitesi",
    university: "İzmir Ekonomi Üniversitesi",
    city: "İzmir",
    area: "Ege",
    location: {
      lat: 38.3885,
      lng: 27.0438
    },
    logo: "/logos/izmirekonomiuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.izmirekonomiuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdizmirekonomiuniversitesi",
      linkedin: "hsd-izmirekonomiuniversitesi"
    },
    contactEmail: "hsd@izmirekonomiuniversitesi.edu.tr",
    memberCount: 70,
    yearFounded: 2023
  },
  {
    id: 55,
    name: "HSD Kahramanmaraş Sütçü İmam Üniversitesi",
    university: "Kahramanmaraş Sütçü İmam Üniversitesi",
    city: "Kahramanmaraş",
    area: "Akdeniz",
    location: {
      lat: 37.5849,
      lng: 36.8020
    },
    logo: "/logos/kahramanmarassutcuimamuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.kahramanmarassutcuimamuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdkahramanmarassutcuimamuniversitesi",
      linkedin: "hsd-kahramanmarassutcuimamuniversitesi"
    },
    contactEmail: "hsd@kahramanmarassutcuimamuniversitesi.edu.tr",
    memberCount: 111,
    yearFounded: 2023
  },
  {
    id: 56,
    name: "HSD Okan Üniversitesi",
    university: "Okan Üniversitesi",
    city: "İstanbul",
    area: "Marmara",
    location: {
      lat: 40.9741,
      lng: 29.2268
    },
    logo: "/logos/okanuniversitesi.png",
    description: "Huawei teknolojileri alanında kendini geliştirmek isteyen öğrencileri bir araya getiren bir topluluktur.",
    website: "https://hsd.okanuniversitesi.edu.tr",
    socialMedia: {
      instagram: "@hsdokanuniversitesi",
      linkedin: "hsd-okanuniversitesi"
    },
    contactEmail: "hsd@okanuniversitesi.edu.tr",
    memberCount: 112,
    yearFounded: 2022
  }
];

export default clubsData;