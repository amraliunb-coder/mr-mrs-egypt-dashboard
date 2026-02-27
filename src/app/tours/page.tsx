'use client';

import { useEffect, useState } from 'react';
import { getTours, addTour, updateTour, deleteTour, importTours, exportToCsv, resetTours } from '@/lib/store';
import { Tour, TourWithComputed } from '@/lib/types';
import TourForm from '@/components/tours/TourForm';
import CsvUpload from '@/components/tours/CsvUpload';
import { Plus, Upload, Download, Search, Trash2, Edit, Map, RefreshCw } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function ToursPage() {
    const [tours, setTours] = useState<TourWithComputed[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [editingTour, setEditingTour] = useState<TourWithComputed | null>(null);

    const refresh = () => setTours(getTours());

    useEffect(() => { refresh(); }, []);

    const filtered = tours.filter(t => {
        const matchSearch = t.tourName.toLowerCase().includes(search.toLowerCase()) ||
            t.customerName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleAddTour = (tour: Omit<Tour, 'id'>) => {
        addTour(tour);
        setShowForm(false);
        refresh();
    };

    const handleEditTour = (tour: Omit<Tour, 'id'>) => {
        if (editingTour) {
            updateTour(editingTour.id, tour);
            setEditingTour(null);
            refresh();
        }
    };

    const handleDeleteTour = (id: string) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            deleteTour(id);
            refresh();
        }
    };

    const handleImport = (newTours: Omit<Tour, 'id'>[]) => {
        importTours(newTours);
        setShowUpload(false);
        refresh();
    };

    const handleExport = () => {
        const csv = exportToCsv();
        if (!csv) return;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mme-tours-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <>
            <div className="page-header">
                <h1>Tour Management</h1>
                <div className="btn-group">
                    <button className="btn btn-secondary" onClick={() => setShowUpload(true)}>
                        <Upload size={16} /> Upload CSV
                    </button>
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <Download size={16} /> Export
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => { if (confirm('Sync will replace all current data with the latest table data. Proceed?')) resetTours(); }}
                        style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}
                    >
                        <RefreshCw size={16} /> Sync Table Data
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <Plus size={16} /> Add Tour
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-wrapper">
                    <Search size={16} />
                    <input
                        className="search-input"
                        placeholder="Search tours or customers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ minWidth: '140px' }}
                >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="arrived">Arrived</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {filtered.length} tour{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {filtered.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Map size={48} />
                        <h3>No tours found</h3>
                        <p>{tours.length === 0 ? 'Add your first tour to get started' : 'Try adjusting your filters'}</p>
                        {tours.length === 0 && (
                            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setShowForm(true)}>
                                <Plus size={16} /> Add First Tour
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tour Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Duration</th>
                                    <th>Customer</th>
                                    <th>Cost</th>
                                    <th>Retail</th>
                                    <th>Profit</th>
                                    <th>Margin</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.tourName}</td>
                                        <td>{t.date}</td>
                                        <td>{t.endDate || t.date}</td>
                                        <td>{differenceInDays(parseISO(t.endDate || t.date), parseISO(t.date)) + 1} Days</td>
                                        <td>{t.customerName}</td>
                                        <td>{fmt(t.costPrice)}</td>
                                        <td>{fmt(t.retailPrice)}</td>
                                        <td className={t.profit >= 0 ? 'text-green' : 'text-red'}>{fmt(t.profit)}</td>
                                        <td className={t.marginPercent >= 0 ? 'text-green' : 'text-red'}>{t.marginPercent.toFixed(1)}%</td>
                                        <td><span className={`status-badge status-${t.status}`}>{t.status}</span></td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-ghost btn-sm" onClick={() => setEditingTour(t)}>
                                                    <Edit size={14} />
                                                </button>
                                                <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteTour(t.id)} style={{ color: 'var(--accent-red)' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && <TourForm onSubmit={handleAddTour} onClose={() => setShowForm(false)} />}
            {editingTour && <TourForm tour={editingTour} onSubmit={handleEditTour} onClose={() => setEditingTour(null)} />}
            {showUpload && <CsvUpload onImport={handleImport} onClose={() => setShowUpload(false)} />}
        </>
    );
}
