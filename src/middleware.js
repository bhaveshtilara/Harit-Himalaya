import { NextResponse } from 'next/server';
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === '/login' ||
    path === '/register';
  const token = request.cookies.get('token')?.value || '';
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}
export const config = {
  matcher: [
    '/dashboard',
    '/verifier/dashboard',
    '/leaderboard',
    '/login',
    '/profile',
    '/admin/:path*',
    '/register',
  ],
};