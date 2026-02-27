'use client';

import { DashboardSummary } from '@/lib/types';
import { DollarSign, TrendingUp, BarChart3, Calendar } from 'lucide-react';

interface Props {
    summary: DashboardSummary;
}

export default function SummaryCards({ summary }: Props) {
    const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="summary-grid">
            <div className="summary-card">
                <div className="summary-card-icon"><DollarSign size={16} /></div>
                <div className="summary-card-label">Total Revenue</div>
                <div className="summary-card-value">{fmt(summary.totalRevenue)}</div>
                <div className="summary-card-sub">
                    Paid: {fmt(summary.totalRetailPaid)} · Remaining: {fmt(summary.totalRetailRemaining)}
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-card-icon"><BarChart3 size={16} /></div>
                <div className="summary-card-label">Total Costs</div>
                <div className="summary-card-value">{fmt(summary.totalCosts)}</div>
                <div className="summary-card-sub">
                    Paid: {fmt(summary.totalCostPaid)} · Remaining: {fmt(summary.totalCostRemaining)}
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-card-icon"><TrendingUp size={16} /></div>
                <div className="summary-card-label">Grand Profit</div>
                <div className="summary-card-value">{fmt(summary.totalProfit)}</div>
                <div className="summary-card-sub">
                    Margin: {summary.profitMargin.toFixed(1)}%
                </div>
            </div>

            <div className="summary-card">
                <div className="summary-card-icon"><Calendar size={16} /></div>
                <div className="summary-card-label">Total Bookings</div>
                <div className="summary-card-value">{summary.totalBookings}</div>
                <div className="summary-card-sub">
                    All tours
                </div>
            </div>
        </div>
    );
}
