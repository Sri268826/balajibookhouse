import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { randomBytes } from 'crypto';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create random filename to avoid collisions
        const ext = path.extname(file.name);
        const filename = `${randomBytes(16).toString('hex')}${ext}`;

        // UPLOAD_DIR should point to the persistent disk on Render
        // e.g. /opt/render/project/src/data/uploads
        // Falls back to public/uploads for local development
        const uploadDir = process.env.UPLOAD_DIR
            ? process.env.UPLOAD_DIR
            : path.join(process.cwd(), 'public', 'uploads');

        // Ensure dir exists
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        // Determine type based on extension or mime type
        const mimeType = file.type;
        const type = mimeType.startsWith('video/') ? 'video' : 'image';

        // If using persistent disk, serve via /api/media/ route (not static public/)
        const url = process.env.UPLOAD_DIR
            ? `/api/media/${filename}`
            : `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            type
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
