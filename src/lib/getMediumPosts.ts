import Parser from 'rss-parser';

// Node.js modüllerini yalnızca sunucu tarafında yükle
let fs: any;
let path: any;

if (typeof window === 'undefined') {
  // Sunucu tarafında çalışıyoruz
  import('fs').then((module) => {
    fs = module.default;
  });
  import('path').then((module) => {
    path = module.default;
  });
}

export type BlogPost = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  author: string;
  thumbnail: string;
  readingTimeMinutes?: number;
  id?: string;
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

// Yerel dosyadan blogları okuma
export async function readStoredPosts(): Promise<BlogPost[]> {
  try {
    // Server-side only
    if (typeof window === 'undefined') {
      // Dinamik olarak modülleri import et
      if (!fs || !path) {
        fs = (await import('fs')).default;
        path = (await import('path')).default;
      }
      
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'medium-posts.json');
      
      // Dizin yoksa oluştur
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Dosya yoksa boş bir dizi oluştur
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
        return [];
      }
      
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as BlogPost[];
    }
    return [];
  } catch (error) {
    console.error('Kaydedilmiş blog yazıları okunamadı:', error);
    return [];
  }
}

// Blogları yerel dosyaya kaydetme
export async function storePosts(posts: BlogPost[]): Promise<void> {
  try {
    // Server-side only
    if (typeof window === 'undefined') {
      // Dinamik olarak modülleri import et
      if (!fs || !path) {
        fs = (await import('fs')).default;
        path = (await import('path')).default;
      }
      
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'medium-posts.json');
      
      // Dizin yoksa oluştur
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Blog yazıları kaydedilemedi:', error);
  }
}

// Belirli bir Medium hesabı için blog yazılarını alma
export async function getMediumPostsFromUser(username: string = '@hsdfiratuniversity'): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL(`https://medium.com/feed/${username}`);

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
        readingTimeMinutes,
        id: item.guid || item.link
      };
    });
  } catch (error) {
    console.error(`Medium post verileri çekilemedi (${username}):`, error);
    return [];
  }
}

// Geriye uyumluluk için
export async function getMediumPosts(): Promise<BlogPost[]> {
  return getMediumPostsFromUser('@hsdfiratuniversity');
}

// Birden fazla kaynaktan tüm Medium yazılarını alma
export async function getAllMediumPosts(): Promise<BlogPost[]> {
  // Yerel dosyadan kaydedilmiş yazıları oku
  const storedPosts = await readStoredPosts();
  
  // Yeni yazıları al
  const usernames = ['@hsdfiratuniversity']; // Buraya takip etmek istediğiniz diğer Medium hesaplarını ekleyebilirsiniz
  const newPostsPromises = usernames.map(username => getMediumPostsFromUser(username));
  const allNewPostsArrays = await Promise.all(newPostsPromises);
  
  // Tüm yeni yazıları düzleştir
  const allNewPosts = allNewPostsArrays.flat();
  
  // Yazıları birleştir ve mükerrer olanları çıkar
  const combinedPosts = [...storedPosts];
  
  // Yeni gelen her yazı için
  for (const newPost of allNewPosts) {
    // Eğer bu yazı zaten kayıtlıysa atla
    const existingPostIndex = combinedPosts.findIndex(p => p.id === newPost.id || p.link === newPost.link);
    
    if (existingPostIndex === -1) {
      // Yoksa ekle
      combinedPosts.push(newPost);
    }
  }
  
  // Tarih sırasına göre sırala (en yeni en üstte)
  const sortedPosts = combinedPosts.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  
  // Güncellenmiş yazıları kaydet
  await storePosts(sortedPosts);
  
  return sortedPosts;
}
