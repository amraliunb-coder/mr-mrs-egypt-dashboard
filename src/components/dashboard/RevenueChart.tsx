'use client';

import { MonthlyData } from '@/lib/types';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface Props {
    data: MonthlyData[];
}

export default function RevenueChart({ data }: Props) {
    if (data.length === 0) {
        return (
            <div className="card">
                <h3 className="section-title">Revenue & Costs Overview</h3>
                <div className="empty-state">
                    <p>Add tours to see revenue analytics</p>
                </div>
            </div>
        );
    }

    const chartData = {
        labels: data.map(d => d.month),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Revenue',
                data: data.map(d => d.revenue),
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
                    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.8)');
                    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.05)');
                    return gradient;
                },
                borderColor: '#D4AF37',
                borderWidth: 0,
                borderRadius: 4,
                barPercentage: 0.7,
            },
            {
                type: 'bar' as const,
                label: 'Costs',
                data: data.map(d => d.costs),
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
                    gradient.addColorStop(0, 'rgba(96, 165, 250, 0.6)');
                    gradient.addColorStop(1, 'rgba(96, 165, 250, 0.05)');
                    return gradient;
                },
                borderColor: '#60a5fa',
                borderWidth: 0,
                borderRadius: 4,
                barPercentage: 0.7,
            },
            {
                type: 'line' as const,
                label: 'Profit',
                data: data.map(d => d.profit),
                borderColor: '#34d399',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#34d399',
                pointRadius: 4,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#888888', font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 20 },
            },
            tooltip: {
                backgroundColor: '#161616',
                borderColor: '#262626',
                borderWidth: 1,
                titleColor: '#FFFFFF',
                bodyColor: '#A3A3A3',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
                        `${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [4, 4] },
                ticks: { color: '#888888', font: { family: 'Inter', size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [4, 4] },
                ticks: {
                    color: '#888888',
                    font: { family: 'Inter', size: 11 },
                    callback: (value: string | number) => '$' + Number(value).toLocaleString(),
                },
            },
        },
    };

    return (
        <div className="card">
            <h3 className="section-title">Revenue & Costs Overview</h3>
            <div className="chart-container">
                {/* @ts-expect-error Chart.js mixed chart types */}
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
