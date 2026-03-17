import { NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    // Check if the route is an admin route, but explicitly ignore the login/API routes.
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const tokenSource = request.cookies.get('admin_token');
        const token = tokenSource?.value;
        
        let isValidAuth = false;
        if (token) {
             isValidAuth = await verifyTokenEdge(token);
        }

        if (!isValidAuth) {
            // Redirect unauthorized users instantly to the login page
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Ensure the middleware is only deliberately invoked on relevant paths to protect performance.
export const config = {
    matcher: ['/admin/:path*'],
};
