import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
export async function GET() {
    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const info = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
        return NextResponse.json({ success: true, id: info.lastInsertRowid, name: name.trim() });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!(await verifyAuth())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // Check if any products are using this category
        const usageCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id);
        if (usageCount.count > 0) {
            return NextResponse.json({ error: `Cannot delete: ${usageCount.count} product(s) are using this category. Reassign them first.` }, { status: 400 });
        }

        db.prepare('DELETE FROM categories WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
