'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, PlusCircle, Settings, Home } from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/admin/login') {
        return <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '0 1rem' }}>{children}</div>;
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (e) { /* ignore */ }
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
        { href: '/', label: 'Back to Shop', icon: Home, exact: true }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'var(--bg-elevated)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 className="brand" style={{ fontSize: '1.5rem', margin: 0 }}>Admin Panel</h2>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => {
                        const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: isActive ? '600' : '500',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                            padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                            color: 'var(--danger)', fontWeight: '500', textAlign: 'left'
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
