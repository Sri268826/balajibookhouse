import Link from 'next/link';
import ProductsClient from './ProductsClient';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

function getProducts() {
    try {
        const rows = db.prepare(`
            SELECT p.*, c.name as category_name,
                json_group_array(json_object('id', m.id, 'url', m.url, 'type', m.type)) as media
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_media m ON p.id = m.product_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `).all();
        const products = rows.map(p => ({ ...p, media: JSON.parse(p.media).filter(m => m.id !== null) }));
        return { products, pagination: { total: products.length } };
    } catch (e) {
        console.error('getProducts error:', e);
        return { products: [], pagination: { total: 0 } };
    }
}

function getCategories() {
    try {
        return db.prepare('SELECT * FROM categories ORDER BY name').all();
    } catch (e) {
        console.error('getCategories error:', e);
        return [];
    }
}

export default async function ProductsPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const categoryId = resolvedParams?.category || '';

    const products = getProducts();
    const categories = getCategories();

    return (
        <div className="container">
            <ProductsClient
                products={products}
                categories={categories}
                initialCategory={categoryId}
            />
        </div>
    );
}
