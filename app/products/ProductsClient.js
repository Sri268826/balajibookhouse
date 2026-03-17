'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const PAGE_SIZE = 24;

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function ProductsClient({ categories, initialCategory }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasMore: false });
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const debouncedSearch = useDebounce(search, 350);
    const isFirstRender = useRef(true);

    // Build API URL
    const buildUrl = useCallback((page = 1, cat = selectedCategory, q = debouncedSearch) => {
        const params = new URLSearchParams({ page, limit: PAGE_SIZE });
        if (cat) params.set('category', cat);
        if (q) params.set('search', q);
        return `/api/products?${params}`;
    }, [selectedCategory, debouncedSearch]);

    // Fetch first page (resets list)
    const fetchFirst = useCallback(async (cat, q) => {
        setLoading(true);
        try {
            const res = await fetch(buildUrl(1, cat, q));
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProducts(data.products || []);
            setPagination(data.pagination || {});
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [buildUrl]);

    // Load more (append)
    const loadMore = async () => {
        if (loadingMore || !pagination.hasMore) return;
        setLoadingMore(true);
        try {
            const nextPage = pagination.page + 1;
            const res = await fetch(buildUrl(nextPage));
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProducts(prev => [...prev, ...(data.products || [])]);
            setPagination(data.pagination || {});
        } catch {
            // silent
        } finally {
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchFirst(selectedCategory, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-fetch when search or category changes
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        fetchFirst(selectedCategory, debouncedSearch);
    }, [debouncedSearch, selectedCategory, fetchFirst]);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
    };

    return (
        <div style={{ padding: '3rem 0' }}>
            {/* Page header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '0.35rem', color: 'var(--text-main)' }}>All Products</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Browse our complete catalog of retail and wholesale items.</p>
            </div>

            {/* Search + Filter row */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>

                {/* Search input */}
                <div style={{ position: 'relative', width: '320px', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search products…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.875rem', width: '100%' }}
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch('')} style={{
                            position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            display: 'flex', padding: '0.25rem'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Category pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => handleCategoryChange('')} style={{
                        padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.815rem', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.15s', border: '1.5px solid',
                        backgroundColor: selectedCategory === '' ? 'var(--primary)' : 'transparent',
                        borderColor: selectedCategory === '' ? 'var(--primary)' : 'var(--border-color)',
                        color: selectedCategory === '' ? 'white' : 'var(--text-muted)',
                    }}>All</button>
                    {categories.map(cat => (
                        <button type="button" key={cat.id} onClick={() => handleCategoryChange(String(cat.id))} style={{
                            padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.815rem', fontWeight: '500',
                            cursor: 'pointer', transition: 'all 0.15s', border: '1.5px solid',
                            backgroundColor: selectedCategory === String(cat.id) ? 'var(--primary)' : 'transparent',
                            borderColor: selectedCategory === String(cat.id) ? 'var(--primary)' : 'var(--border-color)',
                            color: selectedCategory === String(cat.id) ? 'white' : 'var(--text-muted)',
                        }}>{cat.name}</button>
                    ))}
                </div>

                {/* Result count */}
                {!loading && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {pagination.total?.toLocaleString()} {pagination.total === 1 ? 'product' : 'products'}
                    </span>
                )}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.75rem' }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={{
                            height: '340px', borderRadius: 'var(--radius-lg)',
                            backgroundColor: '#f3f4f6', animation: 'pulse 1.5s ease-in-out infinite',
                            animationDelay: `${i * 0.05}s`
                        }} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d1d5db', margin: '0 auto 1rem', display: 'block' }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Products Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {search ? `No results for "${search}". Try a different keyword.` : 'No products in this category yet.'}
                    </p>
                    <button type="button" onClick={() => { setSearch(''); setSelectedCategory(''); }} className="btn btn-primary">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid-cols-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Load More */}
                    {pagination.hasMore && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                Showing {products.length.toLocaleString()} of {pagination.total?.toLocaleString()} products
                            </p>
                            <button
                                type="button"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="btn btn-secondary"
                                style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '10px', minWidth: '160px' }}
                            >
                                {loadingMore ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                        </svg>
                                        Loading…
                                    </span>
                                ) : 'Load More Products'}
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
