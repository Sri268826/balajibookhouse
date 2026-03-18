import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request, { params }) {
    const { filename } = await params;

    // Sanitize filename — prevent path traversal attacks
    const safeName = path.basename(filename);

    const uploadDir = process.env.UPLOAD_DIR
        ? process.env.UPLOAD_DIR
        : path.join(process.cwd(), 'public', 'uploads');

    const filePath = path.join(uploadDir, safeName);

    try {
        const fileBuffer = await fs.readFile(filePath);

        // Determine content type from extension
        const ext = path.extname(safeName).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mov': 'video/quicktime',
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
