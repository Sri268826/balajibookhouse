import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

const PAGE_SIZE = 24; // products per page

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const latest = searchParams.get('latest');
    const search = searchParams.get('search')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10));
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (category) {
        conditions.push('p.category_id = ?');
        params.push(category);
    }
    if (latest === 'true') {
        conditions.push('p.is_latest = 1');
    }
    if (search) {
        conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count total for pagination metadata
    const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
    `;

    const dataQuery = `
        SELECT p.*, c.name as category_name,
            json_group_array(json_object('id', m.id, 'url', m.url, 'type', m.type)) as media
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_media m ON p.id = m.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;

    try {
        const { total } = db.prepare(countQuery).get(...params);
        const rows = db.prepare(dataQuery).all(...params, limit, offset);

        const products = rows.map(p => ({
            ...p,
            media: JSON.parse(p.media).filter(m => m.id !== null)
        }));

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            }
        });
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { name, description, price, category_id, is_latest, media } = data;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }

        const info = db.prepare(`
            INSERT INTO products (name, description, price, category_id, is_latest)
            VALUES (?, ?, ?, ?, ?)
        `).run(name, description, price || 0, category_id, is_latest ? 1 : 0);

        const productId = info.lastInsertRowid;

        if (media && Array.isArray(media)) {
            const insertMedia = db.prepare('INSERT INTO product_media (product_id, url, type) VALUES (?, ?, ?)');
            for (const m of media) {
                insertMedia.run(productId, m.url, m.type);
            }
        }

        return NextResponse.json({ success: true, id: productId });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
