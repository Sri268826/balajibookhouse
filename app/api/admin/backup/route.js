import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/admin/backup — export all products + categories as JSON
export async function GET(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();

        const products = db.prepare(`
            SELECT p.*, c.name as category_name,
                json_group_array(json_object('url', m.url, 'type', m.type)) as media
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_media m ON p.id = m.product_id
            GROUP BY p.id
            ORDER BY p.id
        `).all().map(p => ({
            ...p,
            media: JSON.parse(p.media).filter(m => m.url !== null)
        }));

        const backup = {
            version: 1,
            exported_at: new Date().toISOString(),
            categories,
            products,
        };

        return new Response(JSON.stringify(backup, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="bbh-backup-${new Date().toISOString().split('T')[0]}.json"`,
            },
        });
    } catch (error) {
        console.error('Backup error:', error);
        return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
    }
}

// POST /api/admin/backup — restore from a backup JSON
export async function POST(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const backup = await request.json();

        if (!backup.categories || !backup.products) {
            return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });
        }

        // Run the entire restore in a transaction for safety
        const restore = db.transaction(() => {
            // Restore categories first, keeping track of old_id → new_id mapping
            const categoryIdMap = {};
            for (const cat of backup.categories) {
                // Try to insert; if name already exists, get existing id
                const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(cat.name);
                if (existing) {
                    categoryIdMap[cat.id] = existing.id;
                } else {
                    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(cat.name);
                    categoryIdMap[cat.id] = result.lastInsertRowid;
                }
            }

            let restored = 0;
            let skipped = 0;

            for (const product of backup.products) {
                // Skip if a product with the same name already exists
                const existing = db.prepare('SELECT id FROM products WHERE name = ?').get(product.name);
                if (existing) {
                    skipped++;
                    continue;
                }

                const newCategoryId = product.category_id ? categoryIdMap[product.category_id] : null;

                const result = db.prepare(`
                    INSERT INTO products (name, description, price, category_id, is_latest, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(
                    product.name,
                    product.description || null,
                    product.price || 0,
                    newCategoryId || null,
                    product.is_latest || 0,
                    product.created_at || new Date().toISOString()
                );

                const newProductId = result.lastInsertRowid;

                // Restore media
                if (product.media && Array.isArray(product.media)) {
                    const insertMedia = db.prepare('INSERT INTO product_media (product_id, url, type) VALUES (?, ?, ?)');
                    for (const m of product.media) {
                        if (m.url) insertMedia.run(newProductId, m.url, m.type || 'image');
                    }
                }

                restored++;
            }

            return { restored, skipped };
        });

        const result = restore();

        return NextResponse.json({
            success: true,
            message: `Restored ${result.restored} products (${result.skipped} skipped — already exist).`,
            ...result
        });
    } catch (error) {
        console.error('Restore error:', error);
        return NextResponse.json({ error: 'Restore failed: ' + error.message }, { status: 500 });
    }
}
