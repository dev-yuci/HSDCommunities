import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    const feed = await parser.parseURL('https://medium.com/feed/huawei-developers-tr');
    
    // Her makale için istatistikleri topla
    const stats = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      // Medium'un RSS feed'inde view/read sayıları yok, 
      // bu yüzden bunları ayrı bir API'den çekmemiz gerekecek
    }));

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Medium stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Medium stats' },
      { status: 500 }
    );
  }
} 