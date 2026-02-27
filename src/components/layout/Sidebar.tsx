'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, CalendarDays, Users, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tours', label: 'Tours', icon: Map, reqRole: 'admin' },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/customers', label: 'Customers', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <>
            <button className="btn btn-ghost mobile-toggle" onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>
            <aside className={`sidebar ${open ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div className="sidebar-brand" style={{ justifyContent: 'center', padding: '24px 16px' }}>
                    <img
                        src="https://res.cloudinary.com/drzid08rg/image/upload/v1765208093/colored-logo_tjemee.png"
                        alt="Mr & Mrs Egypt Logo"
                        style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain' }}
                    />
                </div>
                <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
                    {navItems.map(item => {
                        if (item.reqRole && user?.role !== item.reqRole) return null;

                        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item ${active ? 'active' : ''}`}
                                onClick={() => setOpen(false)}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {user && (
                    <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ marginBottom: '16px', padding: '0 12px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.role === 'admin' ? 'Administrator' : 'User'}</div>
                        </div>
                        <button
                            onClick={logout}
                            className="nav-item"
                            style={{
                                width: '100%',
                                color: 'var(--accent-red)',
                                background: 'rgba(248, 113, 113, 0.05)'
                            }}
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
