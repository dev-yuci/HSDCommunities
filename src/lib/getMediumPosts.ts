import Parser from 'rss-parser';

export type BlogPost = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  author: string;
  thumbnail: string;
  readingTimeMinutes?: number;
};

export type FeaturedPost = {
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  author: string;
  date: string;
  readingTime: number;
  tags: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
};

// Öne çıkan yazı için sabit veri (normalde CMS'ten veya API'den gelebilir)
export const currentFeaturedPost: FeaturedPost = {
  title: "Huawei Cloud ile Yapay Zeka Modellerini Optimize Etme Rehberi",
  description: "Yapay zeka modellerini eğitirken karşılaşacağınız performans sorunları ve Huawei Cloud'un sunduğu çözümlerle bu sorunların nasıl aşılabileceğini detaylı olarak inceliyoruz. Bu yazımızda, modellerinizi optimize etmek için kullanabileceğiniz teknikleri ve Huawei Cloud'un sunduğu özel araçları ele alıyoruz.",
  thumbnail: "https://cdn-images-1.medium.com/max/1024/1*_ARpBrkmLp6wS7X9fi1wJw.jpeg",
  link: "https://medium.com/@hsdfiratuniversity/huawei-cloud-ile-yapay-zeka-projelerinizi-hızlandırın-b7e421f7d7cc",
  author: "Mehmet Koçak",
  date: "15 Mart 2024",
  readingTime: 12,
  tags: ["Yapay Zeka", "Cloud Computing", "Model Optimizasyonu", "Huawei Cloud"],
  stats: {
    likes: 245,
    comments: 37,
    shares: 128
  }
};

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
    ],
  },
});

// Okuma süresini hesaplamak için yardımcı fonksiyon
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function getMediumPosts(): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@hsdfiratuniversity');

    return feed.items.map((item) => {
      let thumbnail = '/default-thumbnail.jpg';
      
      // 1. media:content varsa al
      if ((item as any)['media:content']?.$?.url) {
        thumbnail = (item as any)['media:content'].$.url;
      }
      // 2. Yoksa content:encoded içinden ilk <img> src'sini çek
      else if ((item as any)['content:encoded']) {
        const htmlContent = (item as any)['content:encoded'] as string;
        const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
        if (match && match[1]) {
          thumbnail = match[1];
        }
      }

      // Okuma süresini hesapla
      const contentEncoded = (item as any)['content:encoded'] || item.content || item.contentSnippet || '';
      const readingTimeMinutes = calculateReadingTime(contentEncoded);

      return {
        title: item.title || '',
        link: item.link || '#',
        pubDate: item.pubDate || '',
        contentSnippet: item.contentSnippet || '',
        author: item.creator || 'Unknown',
        thumbnail,
        readingTimeMinutes
      };
    });
  } catch (error) {
    console.error('Medium post verileri çekilemedi:', error);
    // Hata durumunda boş dizi döndür
    return [];
  }
}
