import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NAMA FUNGSI DIUBAH MENJADI proxy
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname === '/login' && token === 'sah') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};