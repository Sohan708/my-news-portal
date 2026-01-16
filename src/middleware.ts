import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
        // Allow signin page
        if (pathname === '/admin/signin') {
            return NextResponse.next();
        }

        // Check authentication
        const session = await auth();

        if (!session) {
            const signInUrl = new URL('/admin/signin', request.url);
            signInUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Check if user is admin
        const userRole = session.user?.role;
        if (userRole !== 'admin' && userRole !== 'editor') {
            return NextResponse.redirect(new URL('/admin/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
