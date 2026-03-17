import Link from 'next/link';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

async function getProducts() {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${origin}/api/products`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

async function getCategories() {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${origin}/api/categories`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

export default async function ProductsPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const categoryId = resolvedParams?.category || '';

    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
    ]);

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
