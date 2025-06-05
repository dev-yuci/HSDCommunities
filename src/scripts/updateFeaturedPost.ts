import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKey } from '../lib/gemini-config';
import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { execSync } from 'child_process';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['description', 'description']
    ]
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  timeout: 30000
});

// Gemini API yapılandırması
const genAI = new GoogleGenerativeAI(apiKey);

// Puppeteer yapılandırması
const puppeteerConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu'
  ]
};

async function generateSummaryWithGemini(url: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Lütfen aşağıdaki Medium yazısını okuyup 2-3 cümlelik kısa bir özet çıkar. Özet Türkçe olmalı ve yazının ana fikrini yansıtmalı. Yazı linki: ${url}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini ile özet oluşturulurken hata:', error);
    return '';
  }
}

async function retryWithDelay(fn: Function, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;
    if (error.message.includes('429')) {
      console.log(`Rate limit aşıldı. ${delay/1000} saniye bekleniyor...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

function getMediumPostId(url: string): string {
  return url.split('-').pop()?.split('?')[0] || '';
}

async function updateFeaturedPostFromRSS(postUrl: string) {
  try {
    const cleanUrl = decodeURIComponent(postUrl).replace(/\?.*$/, '');
    // URL'den @ işaretini kaldır ve kullanıcı adını al
    const usernameOrPublication = cleanUrl
      .replace('https://medium.com/', '')
      .replace('@', '')
      .split('/')[0];

    if (!usernameOrPublication) {
      throw new Error('Geçersiz Medium URL formatı');
    }

    const isAtUsername = cleanUrl.includes('@');
    const rssUrl = isAtUsername
      ? `https://medium.com/feed/@${usernameOrPublication}`
      : `https://medium.com/feed/${usernameOrPublication}`;
    console.log('RSS URL:', rssUrl);

    let feed;
    try {
      feed = await retryWithDelay(() => parser.parseURL(rssUrl));
    } catch (rssError) {
      console.warn('❗ RSS alınamadı, scraping ile devam ediliyor...');
      const scrapedData = await scrapeMediumPost(cleanUrl);
      return {
        title: scrapedData.title,
        description: scrapedData.description,
        thumbnail: scrapedData.thumbnail || '/images/blog/default-thumbnail.jpg',
        link: cleanUrl,
        author: scrapedData.author,
        date: scrapedData.date,
        readingTime: scrapedData.readingTime || '3',
        tags: scrapedData.tags || [],
        stats: { likes: 0, comments: 0, shares: 0 }
      };
    }
    
    console.log('Feed başlığı:', feed.title);
    console.log('Feed içindeki yazı sayısı:', feed.items.length);

    // URL'leri normalize et ve karşılaştır
    const normalizedCleanUrl = decodeURIComponent(cleanUrl)
      .replace(/^https:\/\/medium\.com\/(?:@)?[^\/]+\//, '')
      .replace(/\?.*$/, '')
      .toLowerCase();

    console.log('Aranan normalize URL:', normalizedCleanUrl);

    const post = feed.items.find((item: { title?: string; link?: string }) => {
      if (!item.link) return false;
      const normalizedItemUrl = decodeURIComponent(item.link)
        .replace(/^https:\/\/medium\.com\/(?:@)?[^\/]+\//, '')
        .replace(/\?.*$/, '')
        .toLowerCase();
      
      console.log('Karşılaştırılan URL:', normalizedItemUrl);
      return getMediumPostId(normalizedItemUrl) === getMediumPostId(normalizedCleanUrl);
    });

    if (post) {
      let thumbnail = '/images/blog/default-thumbnail.jpg';
      const imagePath = path.join(process.cwd(), 'public', 'images', 'blog', 'featured.jpg');
      let coverImgUrl: string | null = null;

      try {
        const browser = await puppeteer.launch(puppeteerConfig);
        const page = await browser.newPage();

        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        );

        await page.goto(cleanUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });

        await new Promise<void>(resolve => setTimeout(resolve, 3000));

        coverImgUrl = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];

          const candidates = imgs.filter(img =>
            img.src.includes('miro.medium.com')
          );

          const selected = candidates.sort((a, b) => {
            const aw = parseInt(a.getAttribute('width') || '0', 10);
            const bw = parseInt(b.getAttribute('width') || '0', 10);
            return bw - aw;
          })[0];

          return selected?.src || null;
        });

        await browser.close();
      } catch (err) {
        console.error('Kapak görseli URL\'si alınamadı:', err);
      }

      console.log('Bulunan kapak görseli:', coverImgUrl);

      if (coverImgUrl) {
        try {
          const response = await axios.get(coverImgUrl, {
            responseType: 'stream',
            headers: {
              'Referer': 'https://medium.com/',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            timeout: 15000,
            maxRedirects: 5,
            validateStatus: (status: number) => status < 500
          });

          if (response.status === 200) {
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
              writer.on('finish', () => resolve());
              writer.on('error', reject);
            });

            thumbnail = '/images/blog/featured.jpg';
            console.log('Kapak görseli başarıyla indirildi ve kaydedildi.');
          } else {
            console.error('Resim indirme başarısız, HTTP kodu:', response.status);
          }
        } catch (err) {
          console.error('Kapak görseli indirilemedi:', err);
        }
      } else {
        console.error('Hiçbir kapak görseli bulunamadı!');
      }

      let description = '';
      
      // Önce Gemini ile özet oluşturmayı dene
      description = await generateSummaryWithGemini(cleanUrl);
      
      // Eğer Gemini özet oluşturamazsa, mevcut yöntemi kullan
      if (!description && post.content) {
        const $ = cheerio.load(post.content);
   
        const mediaElement = $('figure, picture').first();
      
        const firstParagraph = mediaElement.nextAll('p[data-selectable-paragraph]').first();
      
        if (firstParagraph.length) {
          const paragraphText = firstParagraph.text().replace(/\s+/g, ' ').trim();
    
          const sentenceRegex = /[^.!?]+[.!?]+/g;
          const sentences = paragraphText.match(sentenceRegex) || [];
          description = sentences.slice(0, 2).join(' ').trim();
        }
      } else if (post.contentSnippet) {
        description = post.contentSnippet;
      }
      
      const date = new Date(post.isoDate || '').toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const wordCount = post.content?.split(/\s+/).length || 0;
      const readingTime = Math.ceil(wordCount / 200).toString();
      const tags = post.categories || [];

      const featuredPost = {
        title: post.title || '',
        description,
        thumbnail,
        link: cleanUrl,
        author: post.creator || usernameOrPublication,
        date,
        readingTime,
        tags,
        stats: {
          likes: 0,
          comments: 0,
          shares: 0
        }
      };

      return featuredPost;
    } else {
      // 2. Feed'de yoksa scraping ile sayfadan bilgileri çek
      const scrapedData = await scrapeMediumPost(cleanUrl);
      return {
        title: scrapedData.title,
        description: scrapedData.description,
        thumbnail: scrapedData.thumbnail || '/images/blog/default-thumbnail.jpg',
        link: cleanUrl,
        author: scrapedData.author,
        date: scrapedData.date,
        readingTime: scrapedData.readingTime || '3',
        tags: scrapedData.tags || [],
        stats: { likes: 0, comments: 0, shares: 0 }
      };
    }
  } catch (error) {
    console.error('Hata:', error);
    return null;
  }
}

async function getMediumStatsFromPage(url: string) {
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Referer': 'https://medium.com/',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
  });
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, 7000));

  // Claps ve yorum sayısını çek
  const { claps, comments } = await page.evaluate(() => {
    // --- CLAPS ---
    let claps = 0;
    // 1. Doğrudan: .pw-multi-vote-count içindeki button
    const clapBtn = document.querySelector('.pw-multi-vote-count button');
    if (clapBtn && typeof clapBtn.textContent === 'string') {
      let text = clapBtn.textContent.trim();
      if (text.endsWith('K')) {
        claps = Math.round(parseFloat(text) * 1000);
      } else if (text.endsWith('M')) {
        claps = Math.round(parseFloat(text) * 1000000);
      } else if (/^[0-9,.]+$/.test(text)) {
        claps = parseInt(text.replace(/[^0-9]/g, ''));
      }
    }

    if (!claps) {
      const possibleClapElements = Array.from(document.querySelectorAll('button, span')).filter(el => {
        const svg = el.querySelector('svg');
        if (!svg) return false;
        const path = svg.querySelector('path');
        if (!path) return false;
        const d = path.getAttribute('d') || '';
        return d.includes('M12 21.35') || d.includes('M12 22');
      });
      for (const el of possibleClapElements) {
        let text = el.textContent?.trim() || '';
        if (/^[0-9,.]+[KM]?$/.test(text)) {
          if (text.endsWith('K')) {
            claps = Math.round(parseFloat(text) * 1000);
          } else if (text.endsWith('M')) {
            claps = Math.round(parseFloat(text) * 1000000);
          } else {
            claps = parseInt(text.replace(/[^0-9]/g, ''));
          }
          break;
        }
      }
    }

    let comments = 0;
    const commentSpan = document.querySelector('.pw-responses-count');
    if (commentSpan && typeof commentSpan.textContent === 'string') {
      let t = commentSpan.textContent.replace(/[^0-9]/g, '').trim();
      if (t && /^\d+$/.test(t)) comments = parseInt(t);
    }

    if (!comments) {
      const commentLink = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('responses'));
      if (commentLink) {
        let t = commentLink.textContent?.replace(/[^0-9]/g, '').trim();
        if (t && /^\d+$/.test(t)) comments = parseInt(t);
      } else {
        const commentIcon = Array.from(document.querySelectorAll('svg')).find(svg =>
          svg.innerHTML.includes('M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z')
        );
        if (commentIcon && commentIcon.parentElement) {
          const sibling = commentIcon.parentElement.nextElementSibling;
          if (sibling && typeof sibling.textContent === 'string') {
            let t = sibling.textContent.replace(/[^0-9]/g, '').trim();
            if (t && /^\d+$/.test(t)) comments = parseInt(t);
          }
        }
      }
    }

    return { claps, comments };
  });

  await browser.close();
  return { likes: claps, comments, shares: 0 };
}

async function getCoverImageFromMedium(url: string) {
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, 3000));

  const coverImg = await page.evaluate(() => {
    const figureImg = document.querySelector('figure img') as HTMLImageElement | null;
    if (figureImg && figureImg.src) return figureImg.src;
    const coverDiv = document.querySelector('section[data-testid="Hero"] div[style*="background-image"]') as HTMLElement | null;
    if (coverDiv) {
      const bg = coverDiv.style.backgroundImage;
      const match = bg.match(/url\\(\"(.+?)\"\\)/);
      if (match) return match[1];
    }
    const pwImg = document.querySelector('.pw-cover-image img') as HTMLImageElement | null;
    if (pwImg && pwImg.src) return pwImg.src;
    return null;
  });

  await browser.close();
  return coverImg;
}

async function scrapeMediumPost(url: string) {
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const data = await page.evaluate(() => {
    let title = document.querySelector('h1')?.textContent?.trim() || '';
    if (!title) {
      // Fallback: <title> etiketi
      title = document.title?.trim() || '';
    }
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      document.querySelector('article p')?.textContent?.trim() || '';
    const author =
      document.querySelector('.pw-author-name')?.textContent?.trim() ||
      document.querySelector('meta[name="author"]')?.getAttribute('content') || '';
    const date =
      document.querySelector('time')?.getAttribute('datetime') ||
      document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || '';
    const readingTime =
      document.querySelector('span.readingTime')?.getAttribute('title')?.replace(/\D/g, '') ||
      '';
    const tags = Array.from(document.querySelectorAll('ul li a[aria-label^="Tag"]')).map(el => el.textContent?.trim() || '');
    const thumbnail =
      document.querySelector('figure img')?.getAttribute('src') ||
      document.querySelector('.pw-cover-image img')?.getAttribute('src') ||
      '';

    return { title, description, author, date, readingTime, tags, thumbnail };
  });

  await browser.close();
  if (!data.title) {
    console.error('UYARI: Scraping ile başlık bulunamadı!');
  }
  return data;
}

async function main() {
  const cleanUrl = process.argv[2];
  if (!cleanUrl) {
    console.error('Lütfen bir Medium yazı URL\'si girin');
    process.exit(1);
  }

  const featuredPost = await updateFeaturedPostFromRSS(cleanUrl);
  const stats = await getMediumStatsFromPage(cleanUrl);
  if (featuredPost) {
    featuredPost.stats = stats;
    if (!featuredPost.title || featuredPost.title === 'medium.com') {
      console.error('UYARI: Yazı başlığı çekilemedi, dosyaya kaydedilmiyor!');
      return;
    }
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'featured-post.json');
    fs.writeFileSync(jsonPath, JSON.stringify(featuredPost, null, 2));
    console.log('Öne çıkan yazı başarıyla güncellendi!');
  }
}

main();
