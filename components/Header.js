'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="container header-inner">
                {/* Brand */}
                <Link href="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '38px', height: '38px',
                        background: 'var(--primary)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                    </div>
                    <div style={{ lineHeight: 1.1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Sri Balaji</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Book House</div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="nav-links" style={{ display: 'flex', gap: '0.25rem' }}>
                    <Link href="/" className="nav-link" style={{ padding: '0.5rem 0.875rem', borderRadius: '6px', transition: 'background-color 0.15s', fontWeight: '500', fontSize: '0.9rem' }}>Home</Link>
                    <Link href="/products" className="nav-link" style={{ padding: '0.5rem 0.875rem', borderRadius: '6px', transition: 'background-color 0.15s', fontWeight: '500', fontSize: '0.9rem' }}>All Products</Link>
                </nav>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <a
                        href="https://wa.me/918088849392"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            backgroundColor: '#25D366', color: 'white',
                            padding: '0.5rem 1rem', borderRadius: '8px',
                            fontWeight: '600', fontSize: '0.875rem',
                            textDecoration: 'none', transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(37,211,102,0.3)'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span className="whatsapp-label">WhatsApp Us</span>
                    </a>

                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none', background: 'none', border: 'none',
                            cursor: 'pointer', padding: '0.5rem', color: 'var(--text-main)'
                        }}
                        aria-label="Toggle menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileMenuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                                : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'white',
                    padding: '1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.25rem'
                }}>
                    <Link href="/" className="nav-link" style={{ padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500' }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link href="/products" className="nav-link" style={{ padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500' }} onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                </div>
            )}

            <style>{`
                .nav-link:hover { background-color: var(--primary-light); color: var(--text-main); }
                .whatsapp-btn:hover { background-color: #128C7E !important; box-shadow: 0 4px 12px rgba(37,211,102,0.4) !important; transform: translateY(-1px); }
                @media (max-width: 768px) {
                    .nav-links { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                    .whatsapp-label { display: none; }
                }
            `}</style>
        </header>
    );
}
