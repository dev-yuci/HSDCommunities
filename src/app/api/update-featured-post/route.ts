import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: 'URL gerekli.' }, { status: 400 });
  }

  return new Promise((resolve) => {
    exec(`npx tsx src/scripts/updateFeaturedPost.ts "${url}"`, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: stderr || error.message }, { status: 500 }));
      } else if (stdout.includes('Yazı bulunamadı')) {
        resolve(NextResponse.json({ error: 'Yazı bulunamadı. Lütfen linki kontrol edin.' }, { status: 404 }));
      } else {
        resolve(NextResponse.json({ message: 'Başarılı', output: stdout }));
      }
    });
  });
}
