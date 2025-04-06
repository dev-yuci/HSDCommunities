import { NextResponse } from 'next/server';
import { getMediumPosts } from '@/lib/getMediumPosts';

export async function GET() {
  try {
    const posts = await getMediumPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Medium verisi çekilemedi:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
