'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getTours, getDashboardSummary, getMonthlyData } from '@/lib/store';
import { TourWithComputed, DashboardSummary, MonthlyData } from '@/lib/types';
import SummaryCards from '@/components/dashboard/SummaryCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import ProfitBreakdown from '@/components/dashboard/ProfitBreakdown';

export default function DashboardPage() {
  const [tours, setTours] = useState<TourWithComputed[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalRevenue: 0, totalCosts: 0, totalProfit: 0, profitMargin: 0,
    totalBookings: 0, totalCostPaid: 0, totalCostRemaining: 0,
    totalRetailPaid: 0, totalRetailRemaining: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const data = getTours();
    setTours(data);
    setSummary(getDashboardSummary(data));
    setMonthlyData(getMonthlyData(data));

    const handleStorage = () => {
      const updated = getTours();
      setTours(updated);
      setSummary(getDashboardSummary(updated));
      setMonthlyData(getMonthlyData(updated));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <span className="page-header-date">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>
      </div>
      <SummaryCards summary={summary} />
      <div className="charts-grid">
        <RevenueChart data={monthlyData} />
        <div className="card">
          <h3 className="section-title">Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
            <div>
              <div className="summary-card-label">Cost Recovery</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                  {summary.totalCosts > 0 ? ((summary.totalCostPaid / summary.totalCosts) * 100).toFixed(1) : '0.0'}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>of costs paid</span>
              </div>
              <div style={{
                height: '6px', background: 'var(--bg-card-hover)', borderRadius: '3px', marginTop: '8px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #60a5fa, #93c5fd)',
                  boxShadow: '0 0 8px rgba(96, 165, 250, 0.4)',
                  width: `${summary.totalCosts > 0 ? Math.min((summary.totalCostPaid / summary.totalCosts) * 100, 100) : 0}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div>
              <div className="summary-card-label">Revenue Collection</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                  {summary.totalRevenue > 0 ? ((summary.totalRetailPaid / summary.totalRevenue) * 100).toFixed(1) : '0.0'}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>of retail collected</span>
              </div>
              <div style={{
                height: '6px', background: 'var(--bg-card-hover)', borderRadius: '3px', marginTop: '8px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  borderRadius: '3px',
                  background: 'var(--gold-gradient)',
                  boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
                  width: `${summary.totalRevenue > 0 ? Math.min((summary.totalRetailPaid / summary.totalRevenue) * 100, 100) : 0}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div>
              <div className="summary-card-label">Profit Margin</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                  {summary.profitMargin.toFixed(1)}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>grand margin</span>
              </div>
              <div style={{
                height: '6px', background: 'var(--bg-card-hover)', borderRadius: '3px', marginTop: '8px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #34d399, #6ee7b7)',
                  boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)',
                  width: `${Math.min(Math.max(summary.profitMargin, 0), 100)}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div>
              <div className="summary-card-label">Upcoming Tours</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                {tours.filter(t => t.status === 'upcoming').length}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfitBreakdown tours={tours} summary={summary} />
    </>
  );
}
