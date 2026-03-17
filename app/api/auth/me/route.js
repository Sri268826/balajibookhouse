import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    const isAuthenticated = await verifyAuth();
    if (isAuthenticated) {
        return NextResponse.json({ authenticated: true });
    } else {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}

