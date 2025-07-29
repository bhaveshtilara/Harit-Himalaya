import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get('token')?.value || '';
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role;
      if (isPublicPath) {
        if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
        if (userRole === 'VERIFIER') return NextResponse.redirect(new URL('/verifier/dashboard', request.nextUrl));
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }
      if (path.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }
      if (path.startsWith('/verifier') && userRole !== 'VERIFIER') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }

    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', request.nextUrl));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/dashboard',
    '/verifier/:path*',
    '/leaderboard',
    '/profile',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};