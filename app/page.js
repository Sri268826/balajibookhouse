import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getLatestProducts() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${origin}/api/products?latest=true&limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
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

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: 'Quality Assured',
    desc: 'Every product is curated for quality — you get the best every time.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    title: 'Wholesale & Retail',
    desc: 'We cater to both individual buyers and bulk wholesale orders.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Easy Enquiries',
    desc: 'Reach us directly on WhatsApp — fast responses, no hassle.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    title: 'Wide Selection',
    desc: 'Textbooks, stationery, and more — all in one place.',
  },
];

export default async function Home() {
  const [latestProducts, categories] = await Promise.all([
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, #ffffff 40%, #f3f4f6 100%)',
        padding: '7rem 0 5rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div aria-hidden style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, #e5e7eb 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container text-center animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', padding: '0.35rem 1rem', backgroundColor: 'var(--primary-light)',
            color: 'var(--text-main)', fontWeight: '600', fontSize: '0.8rem',
            borderRadius: '9999px', marginBottom: '1.5rem', border: '1px solid var(--border-color)',
            letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            Wholesale &amp; Retail
          </span>
          <h1 style={{ fontSize: '3.75rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: 'var(--text-main)', lineHeight: '1.15' }}>
            Sri Balaji Book House
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: '1.75' }}>
            Your trusted destination for quality books &amp; stationery. Browse our full catalog and enquire directly on WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderRadius: '10px' }}>
              Browse Products
            </Link>
            <a href="https://wa.me/918088849392" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Features strip ───────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '2.25rem 1.75rem',
                borderRight: i < features.length - 1 ? '1px solid var(--border-color)' : 'none',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                <div style={{ color: 'var(--text-main)', opacity: 0.8 }}>{f.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{f.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories showcase ──────────────────── */}
      {categories.length > 0 && (
        <section style={{ padding: '4.5rem 0', backgroundColor: '#fafafa', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Shop by Category</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.95rem' }}>Browse our curated product categories</p>
              </div>
              <Link href="/products" style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}>
                All Products →
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/products" style={{
                padding: '0.625rem 1.25rem', borderRadius: '9999px',
                backgroundColor: 'var(--primary)', color: 'white',
                fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.15s'
              }}>All</Link>
              {categories.map(cat => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} style={{
                  padding: '0.625rem 1.25rem', borderRadius: '9999px',
                  backgroundColor: 'white', color: 'var(--text-main)',
                  fontWeight: '500', fontSize: '0.875rem', textDecoration: 'none',
                  border: '1px solid var(--border-color)', transition: 'all 0.15s'
                }}>{cat.name}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Products ──────────────────────── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Latest Additions</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.95rem' }}>Freshly added to our collection</p>
            </div>
            <Link href="/products" style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none' }}>
              See all →
            </Link>
          </div>

          {latestProducts.length > 0 ? (
            <div className="grid-cols-4">
              {latestProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '1rem', color: 'white' }}>
            Have a question or a bulk order?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Reach out directly on WhatsApp — we respond fast.
          </p>
          <a href="https://wa.me/918088849392" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
            backgroundColor: 'white', color: 'var(--text-main)',
            padding: '0.875rem 2rem', borderRadius: '10px', fontWeight: '700', fontSize: '1rem',
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
