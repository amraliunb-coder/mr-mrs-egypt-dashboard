import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import AuthGuard from '@/components/auth/AuthGuard';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Mr & Mrs Egypt — Tour Dashboard',
  description: 'Admin dashboard for Mr & Mrs Egypt tour business. Track bookings, revenue, costs, and profit margins.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AuthGuard>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
