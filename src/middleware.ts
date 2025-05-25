import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware'in kapsayacağı rotaları tanımla
export const config = {
  matcher: ['/dashboard/coreteam/chat/:path*']
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Cookie'lerden kullanıcı bilgilerini al
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  console.log('Middleware çalışıyor. Path:', pathname);
  console.log('Oturum ve rol:', { authToken, userRole });
  
  // Oturum açılmamışsa login sayfasına yönlendir
  if (!authToken) {
    console.log('Token bulunamadı. Login sayfasına yönlendiriliyor.');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // CoreTeam sayfası için yetki kontrolü yap
  if (userRole !== 'coreteam' && userRole !== 'admin') {
    console.log('Yetkisiz erişim. Kullanıcı paneline yönlendiriliyor.');
    if (userRole === 'user') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  console.log('Erişim izni verildi.');
  return NextResponse.next();
} 