import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#fafafa',
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 0 0'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
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
                                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Sri Balaji Book House</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Wholesale &amp; Retail</div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '320px', fontSize: '0.9rem' }}>
                            Your trusted destination for quality educational books and stationery. Serving customers with wholesale and retail excellence.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <a href="https://wa.me/918088849392" target="_blank" rel="noopener noreferrer" className="footer-social-icon footer-social-whatsapp" title="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                            <a href="mailto:balajibookhouse@gmail.com" className="footer-social-icon footer-social-email" title="Email">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            <li><Link href="/" className="footer-link">Home</Link></li>
                            <li><Link href="/products" className="footer-link">All Products</Link></li>
                            <li><Link href="/admin/login" className="footer-link">Admin</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <div style={{ display: 'flex', gap: '0.625rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a href="tel:+918088849392" style={{ color: 'inherit', textDecoration: 'none' }}>+91 80888 49392</a>
                            </div>
                            <div style={{ display: 'flex', gap: '0.625rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <a href="mailto:balajibookhouse@gmail.com" style={{ color: 'inherit', textDecoration: 'none', wordBreak: 'break-all' }}>balajibookhouse@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        &copy; {new Date().getFullYear()} Sri Balaji Book House. All rights reserved.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Quality you can trust.
                    </p>
                </div>
            </div>

            <style>{`
                .footer-link { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.15s; }
                .footer-link:hover { color: var(--text-main); }
                .footer-social-icon {
                    width: 38px; height: 38px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    text-decoration: none; transition: opacity 0.2s, transform 0.2s;
                }
                .footer-social-icon:hover { opacity: 0.85; transform: translateY(-1px); }
                .footer-social-whatsapp { background-color: #25D366; color: white; }
                .footer-social-email { background-color: var(--primary-light); color: var(--text-main); border: 1px solid var(--border-color); }
                @media (max-width: 768px) {
                    footer .container > div:first-child { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </footer>
    );
}
