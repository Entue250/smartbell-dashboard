// smartbell-dashboard/middleware.js
// Protects all routes — redirects unauthenticated users to /login
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/signup'];

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};