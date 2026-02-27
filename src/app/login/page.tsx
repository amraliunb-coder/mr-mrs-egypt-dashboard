'use client';

import { useState } from 'react';
import { useAuth, User } from '@/lib/auth';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Hardcoded credentials for Mr & Mrs Egypt Dashboard
        if (email === 'amr.ali@mrandmrsegypt.com' && password === 'Bonkai30!!!') {
            const adminUser: User = { email, role: 'admin', name: 'Amr Ali' };
            login(adminUser);
        } else if (email === 'test@mrandmrsegypt.com' && password === 'Password123!') {
            const normalUser: User = { email, role: 'user', name: 'Test User' };
            login(normalUser);
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            position: 'relative',
            padding: '24px'
        }}>
            {/* Background glow effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                maxWidth: '800px',
                maxHeight: '800px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div className="card" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '48px 40px',
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.02)',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <img
                    src="https://res.cloudinary.com/drzid08rg/image/upload/v1765208093/colored-logo_tjemee.png"
                    alt="Mr & Mrs Egypt Logo"
                    style={{ width: '120px', height: 'auto', marginBottom: '24px', objectFit: 'contain' }}
                />

                <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Welcome Back
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
                    Sign in to manage your tours and dashboard.
                </p>

                <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {error && (
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(248, 113, 113, 0.1)', color: 'var(--accent-red)', fontSize: '13px', textAlign: 'center', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Username or Email
                        </label>
                        <div className="search-wrapper" style={{ width: '100%' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '18px', height: '18px' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Username or email"
                                style={{ width: '100%', paddingLeft: '44px', height: '48px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Password
                        </label>
                        <div className="search-wrapper" style={{ width: '100%' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '18px', height: '18px' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••••••••••"
                                style={{ width: '100%', paddingLeft: '44px', height: '48px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            height: '48px',
                            justifyContent: 'center',
                            fontSize: '15px',
                            marginTop: '8px',
                            background: 'var(--gold-gradient)',
                            color: '#0D0D0D', // Dark text for contrast on gold
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)'
                        }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
