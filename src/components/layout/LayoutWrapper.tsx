'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/login') {
        return <main>{children}</main>;
    }

    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
