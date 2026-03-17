import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getProduct(id) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${origin}/api/products/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function ProductDetails({ params }) {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);

    if (!product) {
        return (
            <div className="container text-center" style={{ padding: '8rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Product Not Found</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The product you are looking for does not exist.</p>
                <Link href="/products" className="btn btn-primary">Browse All Products</Link>
            </div>
        );
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const productUrl = `${origin}/products/${product.id}`;
    const phone = '8088849392';

    const shareText = encodeURIComponent(`Check out this product: ${product.name} - ${productUrl}`);
    const shareLink = `https://wa.me/?text=${shareText}`;

    const enquiryText = encodeURIComponent(`Hello, I am interested in this product: ${product.name}. Can you please give more details?`);
    const enquiryLink = `https://wa.me/${phone}?text=${enquiryText}`;

    const primaryMedia = product.media && product.media.length > 0 ? product.media[0] : null;
    const thumbnails = product.media && product.media.length > 1 ? product.media.slice(1, 5) : [];

    return (
        <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
                <span>›</span>
                <Link href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</Link>
                <span>›</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{product.name}</span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                {/* ── Media Column ── */}
                <div>
                    {/* Main image */}
                    <div style={{
                        position: 'relative', paddingTop: '100%',
                        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                        backgroundColor: '#f3f4f6', border: '1px solid var(--border-color)',
                        marginBottom: thumbnails.length > 0 ? '0.75rem' : '0',
                    }}>
                        {primaryMedia ? (
                            primaryMedia.type === 'video' ? (
                                <video src={primaryMedia.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} controls autoPlay muted loop />
                            ) : (
                                <img src={primaryMedia.url} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            )
                        ) : (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {thumbnails.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(thumbnails.length, 4)}, 1fr)`, gap: '0.625rem' }}>
                            {thumbnails.map((m) => (
                                <div key={m.id} style={{
                                    position: 'relative', paddingTop: '100%',
                                    borderRadius: 'var(--radius-md)', overflow: 'hidden',
                                    backgroundColor: '#f3f4f6', border: '1.5px solid var(--border-color)',
                                    cursor: 'pointer'
                                }}>
                                    {m.type === 'video' ? (
                                        <video src={m.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                    ) : (
                                        <img src={m.url} alt="thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Details Column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Category badge */}
                    {product.category_name && (
                        <span style={{
                            display: 'inline-flex', alignSelf: 'flex-start',
                            padding: '0.3rem 0.875rem',
                            backgroundColor: 'var(--primary-light)', color: 'var(--text-main)',
                            fontWeight: '600', borderRadius: '9999px', fontSize: '0.78rem',
                            border: '1px solid var(--border-color)', letterSpacing: '0.04em', textTransform: 'uppercase'
                        }}>
                            {product.category_name}
                        </span>
                    )}

                    {/* Title */}
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1.2', color: 'var(--text-main)', margin: 0 }}>
                        {product.name}
                    </h1>

                    {/* Availability badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)' }}>In Stock</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>· Available for immediate delivery</span>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Description</h3>
                            <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.8' }}>
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <a
                            href={enquiryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', borderRadius: '10px', gap: '0.625rem' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Enquire on WhatsApp
                        </a>
                        <a
                            href={shareLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', borderRadius: '10px', gap: '0.625rem' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                            Share this Product
                        </a>
                    </div>

                    {/* Info strip */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                        marginTop: '0.5rem'
                    }}>
                        {[
                            { icon: '🚚', label: 'Fast Delivery', sub: 'Quick dispatch' },
                            { icon: '💬', label: 'WhatsApp Support', sub: 'Direct enquiries' },
                            { icon: '📦', label: 'Wholesale Available', sub: 'Bulk orders welcome' },
                            { icon: '✅', label: 'Quality Assured', sub: 'Curated selection' },
                        ].map(item => (
                            <div key={item.label} style={{
                                padding: '0.875rem', backgroundColor: 'var(--bg-elevated)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'flex-start', gap: '0.625rem'
                            }}>
                                <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive style */}
            <style>{`
                @media (max-width: 768px) {
                    .product-detail-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
