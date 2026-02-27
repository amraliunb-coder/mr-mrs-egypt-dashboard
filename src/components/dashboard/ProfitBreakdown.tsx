'use client';

import { TourWithComputed, DashboardSummary } from '@/lib/types';

interface Props {
    tours: TourWithComputed[];
    summary: DashboardSummary;
}

export default function ProfitBreakdown({ tours, summary }: Props) {
    const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (tours.length === 0) {
        return (
            <div className="card">
                <h3 className="section-title">Profit Breakdown by Tour</h3>
                <div className="empty-state">
                    <p>Add tours to see profit analysis</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 24px 16px' }}>
                <h3 className="section-title">Profit Breakdown by Tour</h3>
            </div>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Tour Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Customer</th>
                            <th>Cost Price</th>
                            <th>Retail Price</th>
                            <th>Cost Paid</th>
                            <th>Cost Remaining</th>
                            <th>Retail Paid</th>
                            <th>Retail Remaining</th>
                            <th>Profit</th>
                            <th>Margin</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map(t => (
                            <tr key={t.id}>
                                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.tourName}</td>
                                <td>{t.date}</td>
                                <td>{t.endDate || t.date}</td>
                                <td>{t.customerName}</td>
                                <td>{fmt(t.costPrice)}</td>
                                <td>{fmt(t.retailPrice)}</td>
                                <td className="text-green">{fmt(t.costPaid)}</td>
                                <td className={t.costRemaining > 0 ? 'text-red' : 'text-green'}>{fmt(t.costRemaining)}</td>
                                <td className="text-green">{fmt(t.retailPaid)}</td>
                                <td className={t.retailRemaining > 0 ? 'text-red' : 'text-green'}>{fmt(t.retailRemaining)}</td>
                                <td className={t.profit >= 0 ? 'text-green' : 'text-red'}>{fmt(t.profit)}</td>
                                <td className={t.marginPercent >= 0 ? 'text-green' : 'text-red'}>{t.marginPercent.toFixed(1)}%</td>
                                <td>
                                    <span className={`status-badge status-${t.status}`}>{t.status}</span>
                                </td>
                            </tr>
                        ))}
                        <tr className="totals-row">
                            <td colSpan={4}><strong>Grand Totals</strong></td>
                            <td>{fmt(summary.totalCosts)}</td>
                            <td>{fmt(summary.totalRevenue)}</td>
                            <td>{fmt(summary.totalCostPaid)}</td>
                            <td className={summary.totalCostRemaining > 0 ? 'text-red' : ''}>{fmt(summary.totalCostRemaining)}</td>
                            <td>{fmt(summary.totalRetailPaid)}</td>
                            <td className={summary.totalRetailRemaining > 0 ? 'text-red' : ''}>{fmt(summary.totalRetailRemaining)}</td>
                            <td>{fmt(summary.totalProfit)}</td>
                            <td>{summary.profitMargin.toFixed(1)}%</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
