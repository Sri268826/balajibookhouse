import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const media = db.prepare('SELECT id, url, type FROM product_media WHERE product_id = ?').all(id);
        product.media = media;

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const data = await request.json();
        const { name, description, price, category_id, is_latest, media } = data;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }

        db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, category_id = ?, is_latest = ?
      WHERE id = ?
    `).run(name, description, price, category_id, is_latest ? 1 : 0, id);

        // Simplest way to update media: delete old and insert new
        if (media && Array.isArray(media)) {
            db.prepare('DELETE FROM product_media WHERE product_id = ?').run(id);

            const insertMedia = db.prepare('INSERT INTO product_media (product_id, url, type) VALUES (?, ?, ?)');
            for (const m of media) {
                insertMedia.run(id, m.url, m.type);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
