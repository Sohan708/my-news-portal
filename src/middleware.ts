import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/signin', req.url));
        }

        // Check if user has admin or editor role
        if (session.user.role !== 'admin' && session.user.role !== 'editor') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
