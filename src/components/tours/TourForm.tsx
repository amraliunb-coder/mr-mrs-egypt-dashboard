'use client';

import { useState } from 'react';
import { Tour } from '@/lib/types';
import { X } from 'lucide-react';

interface Props {
    tour?: Tour;
    onSubmit: (tour: Omit<Tour, 'id'>) => void;
    onClose: () => void;
}

export default function TourForm({ tour, onSubmit, onClose }: Props) {
    const [form, setForm] = useState({
        tourName: tour?.tourName || '',
        date: tour?.date || '',
        customerName: tour?.customerName || '',
        customerEmail: tour?.customerEmail || '',
        costPrice: tour?.costPrice?.toString() || '',
        retailPrice: tour?.retailPrice?.toString() || '',
        costPaid: tour?.costPaid?.toString() || '0',
        retailPaid: tour?.retailPaid?.toString() || '0',
        status: tour?.status || 'upcoming' as Tour['status'],
        notes: tour?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            tourName: form.tourName,
            date: form.date,
            customerName: form.customerName,
            customerEmail: form.customerEmail || undefined,
            costPrice: parseFloat(form.costPrice) || 0,
            retailPrice: parseFloat(form.retailPrice) || 0,
            costPaid: parseFloat(form.costPaid) || 0,
            retailPaid: parseFloat(form.retailPaid) || 0,
            status: form.status as Tour['status'],
            notes: form.notes || undefined,
        });
    };

    const costPrice = parseFloat(form.costPrice) || 0;
    const retailPrice = parseFloat(form.retailPrice) || 0;
    const costPaid = parseFloat(form.costPaid) || 0;
    const retailPaid = parseFloat(form.retailPaid) || 0;
    const profit = retailPrice - costPrice;
    const margin = retailPrice > 0 ? ((profit / retailPrice) * 100).toFixed(1) : '0.0';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{tour ? 'Edit Tour' : 'Add New Tour'}</h2>
                    <button className="btn btn-ghost" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Tour Name *</label>
                                <input className="form-input" name="tourName" value={form.tourName} onChange={handleChange} required placeholder="e.g. Pyramids & Sphinx Tour" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date *</label>
                                <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Customer Name *</label>
                                <input className="form-input" name="customerName" value={form.customerName} onChange={handleChange} required placeholder="Customer name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Customer Email</label>
                                <input className="form-input" type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="customer@email.com" />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Cost Price ($) *</label>
                                <input className="form-input" type="number" step="0.01" name="costPrice" value={form.costPrice} onChange={handleChange} required placeholder="0.00" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Retail Price ($) *</label>
                                <input className="form-input" type="number" step="0.01" name="retailPrice" value={form.retailPrice} onChange={handleChange} required placeholder="0.00" />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Cost Paid ($)</label>
                                <input className="form-input" type="number" step="0.01" name="costPaid" value={form.costPaid} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Retail Paid ($)</label>
                                <input className="form-input" type="number" step="0.01" name="retailPaid" value={form.retailPaid} onChange={handleChange} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional notes..." />
                        </div>

                        {/* Live calculation preview */}
                        <div style={{
                            background: 'rgba(212, 168, 67, 0.06)',
                            border: '1px solid rgba(212, 168, 67, 0.15)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                        }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                                Calculated Preview
                            </div>
                            <div className="form-grid-3">
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Profit</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: profit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                        ${profit.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Margin</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold-primary)' }}>{margin}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cost Remaining</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: (costPrice - costPaid) > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                                        ${Math.max(0, costPrice - costPaid).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{tour ? 'Update Tour' : 'Add Tour'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
