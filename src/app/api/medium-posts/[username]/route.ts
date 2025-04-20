import { NextResponse } from 'next/server';
import { getMediumPostsFromUser } from '@/lib/getMediumPosts';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    if (!username) {
      return NextResponse.json({ error: 'Kullanıcı adı belirtilmedi' }, { status: 400 });
    }
    
    // @ işaretini kontrol et
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;
    
    const posts = await getMediumPostsFromUser(formattedUsername);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Medium verisi çekilemedi:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
} 