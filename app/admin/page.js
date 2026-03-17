'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, ExternalLink, RefreshCw, Tag, X, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ── Small toast notification ─────────────────────────────────────
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const isError = type === 'error';
    return (
        <div style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.875rem 1.25rem',
            backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '10px', color: isError ? '#dc2626' : '#16a34a',
            fontWeight: '500', fontSize: '0.9rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            animation: 'slideInToast 0.25s ease-out',
        }}>
            {isError ? <AlertCircle size={16} /> : <Check size={16} />}
            {message}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', marginLeft: '0.25rem', display: 'flex' }}>
                <X size={14} />
            </button>
        </div>
    );
}

// ── Category Manager Panel ───────────────────────────────────────
function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            if (res.ok) setCategories(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Category "${newName.trim()}" created!`);
                setNewName('');
                fetchCategories();
            } else {
                showToast(data.error || 'Failed to create category', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (category) => {
        // Use inline confirmation instead of window.confirm
        if (confirmDeleteId !== category.id) {
            setConfirmDeleteId(category.id);
            return;
        }
        setConfirmDeleteId(null);
        try {
            const res = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: category.id }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`Category "${category.name}" deleted.`);
                fetchCategories();
            } else {
                showToast(data.error || 'Failed to delete', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        }
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <Tag size={18} style={{ color: 'var(--text-muted)' }} />
                    <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Categories</h2>
                    <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: '700', padding: '0.1rem 0.5rem', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                        {categories.length}
                    </span>
                </div>
                <button onClick={fetchCategories} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Refresh">
                    <RefreshCw size={15} className={loading ? 'rotate-anim' : ''} />
                </button>
            </div>

            {/* Add new form */}
            <form onSubmit={handleCreate} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.625rem' }}>
                <input
                    type="text"
                    placeholder="Category name (e.g. Textbooks, Stationery…)"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="form-control"
                    style={{ flexGrow: 1, height: '40px', fontSize: '0.9rem' }}
                    maxLength={60}
                />
                <button type="submit" disabled={creating || !newName.trim()} className="btn btn-primary" style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap', opacity: (creating || !newName.trim()) ? 0.6 : 1 }}>
                    <Plus size={16} /> {creating ? 'Creating…' : 'Add Category'}
                </button>
            </form>

            {/* Category list */}
            <div style={{ padding: '0.5rem 0' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>
                ) : categories.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No categories yet. Add one above to get started.
                    </div>
                ) : (
                    <ul style={{ listStyle: 'none' }}>
                        {categories.map((cat, i) => (
                            <li key={cat.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.75rem 1.5rem',
                                borderBottom: i < categories.length - 1 ? '1px solid var(--border-color)' : 'none',
                                transition: 'background-color 0.15s',
                            }} className="cat-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
                                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{cat.name}</span>
                                </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {confirmDeleteId === cat.id ? (
                                            <>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: '600' }}>Confirm?</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.3rem 0.625rem', fontSize: '0.78rem', borderRadius: '6px' }}
                                                >
                                                    Yes, delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.3rem 0.625rem', fontSize: '0.78rem', borderRadius: '6px' }}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={`/products?category=${cat.id}`} target="_blank" className="btn btn-secondary" style={{ padding: '0.35rem 0.625rem', fontSize: '0.75rem', gap: '0.25rem' }} title="View on site">
                                                    <ExternalLink size={13} /> View
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteId(cat.id)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.35rem', borderRadius: '6px' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminPage, setAdminPage] = useState(1);
    const [adminSearch, setAdminSearch] = useState('');
    const [adminPagination, setAdminPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
    const [confirmProductDeleteId, setConfirmProductDeleteId] = useState(null);
    const router = useRouter();

    const fetchProducts = useCallback(async (page = adminPage, q = adminSearch) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 25 });
            if (q) params.set('search', q);
            const res = await fetch(`/api/products?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                setAdminPagination(data.pagination || {});
            } else if (res.status === 401) {
                router.push('/admin/login');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [router, adminPage, adminSearch]);

    useEffect(() => { fetchProducts(1, adminSearch); }, []);
     

    const handlePageChange = (newPage) => {
        setAdminPage(newPage);
        fetchProducts(newPage, adminSearch);
    };

    const handleAdminSearch = (q) => {
        setAdminSearch(q);
        setAdminPage(1);
        fetchProducts(1, q);
    };

    const handleDelete = async (id, name) => {
        if (confirmProductDeleteId !== id) { setConfirmProductDeleteId(id); return; }
        setConfirmProductDeleteId(null);
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        } catch {
            alert('Failed to delete product');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Manage your products and categories</p>
                </div>
                <Link href="/admin/products/new" className="btn btn-primary" style={{ borderRadius: '10px', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Product
                </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1 }}>{products.length}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total Products</div>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                        <Tag size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Manage categories below</div>
                        <Link href="/products" target="_blank" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textDecoration: 'none' }}>View Live Site →</Link>
                    </div>
                </div>
            </div>

            {/* Categories manager */}
            <CategoryManager />

            {/* Products table */}
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M20 7H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>All Products</h2>
                        <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: '700', padding: '0.1rem 0.5rem', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                            {adminPagination.total?.toLocaleString() || 0}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input type="text" placeholder="Search products…" value={adminSearch}
                                onChange={e => handleAdminSearch(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: '2.125rem', height: '36px', fontSize: '0.825rem', width: '220px' }}
                            />
                        </div>
                        <button type="button" onClick={() => fetchProducts(adminPage, adminSearch)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Refresh">
                            <RefreshCw size={15} className={loading ? 'rotate-anim' : ''} />
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr>
                                <th style={{ padding: '0.875rem 1.5rem' }}>Product</th>
                                <th style={{ padding: '0.875rem 1.5rem' }}>Category</th>
                                <th style={{ padding: '0.875rem 1.5rem' }}>Latest</th>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products…</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found. Start by adding one!</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="product-row" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', flexShrink: 0 }}>
                                                {product.media && product.media[0] ? (
                                                    product.media[0].type === 'video'
                                                        ? <video src={product.media[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <img src={product.media[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d1d5db' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{product.name}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {product.category_name ? (
                                                <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--text-main)', padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '1px solid var(--border-color)' }}>
                                                    {product.category_name}
                                                </span>
                                            ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>—</span>}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {product.is_latest ? (
                                                <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>Yes</span>
                                            ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>—</span>}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {confirmProductDeleteId === product.id ? (
                                                    <>
                                                        <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: '600' }}>Confirm?</span>
                                                        <button type="button" onClick={() => handleDelete(product.id, product.name)} className="btn btn-danger" style={{ padding: '0.3rem 0.625rem', fontSize: '0.78rem', borderRadius: '6px' }}>Yes</button>
                                                        <button type="button" onClick={() => setConfirmProductDeleteId(null)} className="btn btn-secondary" style={{ padding: '0.3rem 0.625rem', fontSize: '0.78rem', borderRadius: '6px' }}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/products/${product.id}`} target="_blank" className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="View on site">
                                                            <ExternalLink size={15} />
                                                        </Link>
                                                        <Link href={`/admin/products/${product.id}/edit`} className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Edit">
                                                            <Edit size={15} />
                                                        </Link>
                                                        <button type="button" onClick={() => setConfirmProductDeleteId(product.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table pagination */}
                {adminPagination.totalPages > 1 && (
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                            Page {adminPagination.page} of {adminPagination.totalPages} &nbsp;·&nbsp; {adminPagination.total?.toLocaleString()} products total
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button"
                                onClick={() => handlePageChange(adminPagination.page - 1)}
                                disabled={adminPagination.page <= 1 || loading}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.875rem', fontSize: '0.825rem', borderRadius: '6px', opacity: adminPagination.page <= 1 ? 0.4 : 1 }}>
                                ← Prev
                            </button>
                            <button type="button"
                                onClick={() => handlePageChange(adminPagination.page + 1)}
                                disabled={!adminPagination.hasMore || loading}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.875rem', fontSize: '0.825rem', borderRadius: '6px', opacity: !adminPagination.hasMore ? 0.4 : 1 }}>
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .product-row:hover td { background-color: #fafafa; }
                .cat-row:hover { background-color: #fafafa; }
                .rotate-anim { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes slideInToast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
