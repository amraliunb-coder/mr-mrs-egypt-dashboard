'use client';

import { useEffect, useState } from 'react';
import { getTours, getCustomers } from '@/lib/store';
import { CustomerSummary } from '@/lib/types';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { Users, Search, Mail, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const tours = getTours();
        setCustomers(getCustomers(tours));
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );

    const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <>
            <div className="page-header">
                <h1>Customers</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="search-wrapper">
                        <Search size={16} />
                        <input
                            className="search-input"
                            placeholder="Search customers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Users size={48} />
                        <h3>No customers found</h3>
                        <p>{customers.length === 0 ? 'Customer data is derived from tour entries' : 'Try adjusting your search'}</p>
                    </div>
                </div>
            ) : (
                <div className="customer-grid">
                    {filtered.map(c => (
                        <div
                            key={c.name}
                            className="customer-card"
                            onClick={() => setExpanded(expanded === c.name ? null : c.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            {(() => {
                                const upcomingTours = c.tours.filter(t => t.status === 'upcoming' || t.status === 'arrived').sort((a, b) => a.date.localeCompare(b.date));
                                const nextTour = upcomingTours.length > 0 ? upcomingTours[0] : null;
                                let countdownText = '';
                                if (nextTour) {
                                    if (nextTour.status === 'arrived') {
                                        countdownText = 'ON TOUR (ARRIVED)';
                                    } else {
                                        const today = startOfDay(new Date());
                                        const tourDate = parseISO(nextTour.date);
                                        const days = differenceInDays(tourDate, today);
                                        if (days === 0) countdownText = 'Arriving today!';
                                        else if (days === 1) countdownText = 'Arriving tomorrow';
                                        else if (days > 1) countdownText = `Arriving in ${days} days`;
                                        else countdownText = 'Arrived';
                                    }
                                }

                                return (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div className="customer-name">{c.name}</div>
                                                {c.email && (
                                                    <div className="customer-email">
                                                        <Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                                        {c.email}
                                                    </div>
                                                )}
                                            </div>
                                            {countdownText && (
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    background: nextTour?.status === 'arrived' ? 'rgba(212, 168, 67, 0.15)' : 'rgba(64, 156, 255, 0.15)',
                                                    color: nextTour?.status === 'arrived' ? 'var(--gold-primary)' : 'var(--accent-blue)',
                                                    border: `1px solid ${nextTour?.status === 'arrived' ? 'rgba(212, 168, 67, 0.3)' : 'rgba(64, 156, 255, 0.3)'}`,
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: nextTour?.status === 'arrived' ? '0 0 10px rgba(212, 168, 67, 0.2)' : 'none'
                                                }}>
                                                    <Clock size={12} />
                                                    {countdownText}
                                                </div>
                                            )}
                                        </div>
                                        <div className="customer-stats">
                                            <div>
                                                <div className="customer-stat-label">Bookings</div>
                                                <div className="customer-stat-value" style={{ color: 'var(--accent-blue)' }}>
                                                    <Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                                    {c.totalBookings}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="customer-stat-label">Revenue</div>
                                                <div className="customer-stat-value" style={{ color: 'var(--gold-primary)' }}>
                                                    <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                                                    {c.totalRevenue.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="customer-stat-label">Profit</div>
                                                <div className="customer-stat-value text-green">
                                                    <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                                                    {c.totalProfit.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {expanded === c.name && c.tours.length > 0 && (
                                            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                    Booking History
                                                </div>
                                                <div className="table-wrapper">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Tour</th>
                                                                <th>Start</th>
                                                                <th>End</th>
                                                                <th>Retail</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {c.tours.map(t => (
                                                                <tr key={t.id}>
                                                                    <td>
                                                                        {t.tourLink ? (
                                                                            <a href={t.tourLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
                                                                                {t.tourName}
                                                                            </a>
                                                                        ) : (
                                                                            t.tourName
                                                                        )}
                                                                    </td>
                                                                    <td>{t.date}</td>
                                                                    <td>{t.endDate || t.date}</td>
                                                                    <td>{fmt(t.retailPrice)}</td>
                                                                    <td><span className={`status-badge status-${t.status}`}>{t.status}</span></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                                            Last tour: {c.lastTourDate}
                                            {nextTour && ` • Next tour: ${nextTour.date}`}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
