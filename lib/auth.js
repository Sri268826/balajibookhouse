import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set. This is required for security.');
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
        
        await jwtVerify(token, getJwtSecret());
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
        await jwtVerify(token, getJwtSecret());
        return true;
    } catch {
        return false;
    }
}
