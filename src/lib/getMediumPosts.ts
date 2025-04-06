import Parser from 'rss-parser';

export type BlogPost = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  author: string;
  thumbnail: string;
};

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
    ],
  },
});

export async function getMediumPosts(): Promise<BlogPost[]> {
  const feed = await parser.parseURL('https://medium.com/feed/@hsdfiratuniversity');

  return feed.items.map((item) => {
    let thumbnail = '/default-thumbnail.jpg';

    // 1. media:content varsa al
    if ((item as any)['media:content']?.$?.url) {
      thumbnail = (item as any)['media:content'].$.url;
    }
    // 2. Yoksa content:encoded içinden ilk <img> src’sini çek
    else if ((item as any)['content:encoded']) {
      const htmlContent = (item as any)['content:encoded'] as string;
      const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1]) {
        thumbnail = match[1];
      }
    }

    return {
      title: item.title || '',
      link: item.link || '#',
      pubDate: item.pubDate || '',
      contentSnippet: item.contentSnippet || '',
      author: item.creator || 'Unknown',
      thumbnail,
    };
  });
}
