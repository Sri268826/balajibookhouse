import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        console.error('ERROR: JWT_SECRET environment variable is not set. This is required for security.');
        return null; // Return null so the calling functions can handle auth failure gracefully instead of throwing 500
    }
    return new TextEncoder().encode(process.env.JWT_SECRET);
};

/**
 * Validates the admin_token cookie.
 * @returns {Promise<boolean>} True if authorized, false otherwise.
 */
export async function verifyAuth() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        if (!token) return false;
        
        const secret = getJwtSecret();
        if (!secret) return false;

        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

/**
 * Verifies a token explicitly for Edge environments like Middleware.
 * Does not depend on Next.js headers since middleware accesses cookies directly from the request.
 */
export async function verifyTokenEdge(token) {
    if (!token) return false;
    try {
        const secret = getJwtSecret();
        if (!secret) return false;

        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}
