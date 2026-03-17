'use client';

import Link from 'next/link';

export default function ProductCard({ product }) {
    const primaryMedia = product.media && product.media.length > 0
        ? product.media[0]
        : { url: 'https://via.placeholder.com/400x300?text=No+Image', type: 'image' };

    // Generate WhatsApp links
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${origin}/products/${product.id}`;
    const phone = '8088849392'; // Replace with actual shop phone

    const shareText = encodeURIComponent(`Check out this product: ${product.name} - ${productUrl}`);
    const shareLink = `https://wa.me/?text=${shareText}`;

    const enquiryText = encodeURIComponent(`Hello, I am interested in this product: ${product.name}. Can you give more details?`);
    const enquiryLink = `https://wa.me/${phone}?text=${enquiryText}`;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Link href={`/products/${product.id}`} className="card-image-link image-zoom-container" style={{ display: 'block', position: 'relative', paddingTop: '75%', backgroundColor: '#f3f4f6' }}>
                {primaryMedia.type === 'video' ? (
                    <video
                        src={primaryMedia.url}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        muted loop playsInline autoPlay
                    />
                ) : (
                    <img
                        src={primaryMedia.url}
                        alt={product.name}
                        loading="lazy"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </Link>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--text-main)', lineHeight: '1.3' }}>
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                </div>

                {product.category_name && (
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-hover)', fontSize: '0.75rem', fontWeight: '600', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                        {product.category_name}
                    </span>
                )}

                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem -1.5rem 0', padding: '1.5rem 1.5rem 0' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                        <a href={enquiryLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Customer Enquiry
                    </a>
                    <a href={shareLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        Share
                    </a>
                </div>
                </div>
            </div>
        </div>
    );
}
