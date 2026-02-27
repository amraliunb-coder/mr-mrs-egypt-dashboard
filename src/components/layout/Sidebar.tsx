'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, CalendarDays, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tours', label: 'Tours', icon: Map },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/customers', label: 'Customers', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="btn btn-ghost mobile-toggle" onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>
            <aside className={`sidebar ${open ? 'open' : ''}`}>
                <div className="sidebar-brand" style={{ justifyContent: 'center', padding: '24px 16px' }}>
                    <img
                        src="https://res.cloudinary.com/drzid08rg/image/upload/v1765208093/colored-logo_tjemee.png"
                        alt="Mr & Mrs Egypt Logo"
                        style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain' }}
                    />
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => {
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
            </aside>
        </>
    );
}
