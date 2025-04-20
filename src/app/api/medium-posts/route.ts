import { NextResponse } from 'next/server';
import { getAllMediumPosts } from '@/lib/getMediumPosts';

export async function GET() {
  try {
    // Tüm kaynaklar ve yerel olarak kaydedilmiş yazıları içeren gelişmiş fonksiyonu kullan
    const posts = await getAllMediumPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Medium verisi çekilemedi:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
