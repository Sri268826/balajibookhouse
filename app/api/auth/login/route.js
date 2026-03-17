import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { getJwtSecret } from '@/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await new SignJWT({ sub: user.id, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(getJwtSecret());

        const response = NextResponse.json({ success: true });

        // Set HTTP-only cookie
        response.cookies.set({
            name: 'admin_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
