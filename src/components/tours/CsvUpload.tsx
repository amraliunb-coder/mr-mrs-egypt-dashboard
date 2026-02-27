'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Tour } from '@/lib/types';
import { Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface Props {
    onImport: (tours: Omit<Tour, 'id'>[]) => void;
    onClose: () => void;
}

interface ParsedRow {
    tourName: string;
    date: string;
    customerName: string;
    customerEmail?: string;
    costPrice: number;
    retailPrice: number;
    costPaid: number;
    retailPaid: number;
    status: string;
    notes?: string;
}

const COLUMN_MAP: Record<string, keyof ParsedRow> = {
    'tour name': 'tourName',
    'tour': 'tourName',
    'name': 'tourName',
    'date': 'date',
    'tour date': 'date',
    'customer': 'customerName',
    'customer name': 'customerName',
    'client': 'customerName',
    'email': 'customerEmail',
    'customer email': 'customerEmail',
    'cost': 'costPrice',
    'cost price': 'costPrice',
    'vendor cost': 'costPrice',
    'retail': 'retailPrice',
    'retail price': 'retailPrice',
    'selling price': 'retailPrice',
    'price': 'retailPrice',
    'cost paid': 'costPaid',
    'paid cost': 'costPaid',
    'retail paid': 'retailPaid',
    'paid retail': 'retailPaid',
    'paid': 'retailPaid',
    'status': 'status',
    'notes': 'notes',
    'note': 'notes',
};

export default function CsvUpload({ onImport, onClose }: Props) {
    const [preview, setPreview] = useState<ParsedRow[]>([]);
    const [error, setError] = useState('');
    const [dragover, setDragover] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const parseFile = (file: File) => {
        setError('');
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const rows: ParsedRow[] = results.data.map((raw: unknown) => {
                        const row = raw as Record<string, string>;
                        const mapped: Partial<ParsedRow> = {};
                        Object.entries(row).forEach(([key, value]) => {
                            const normalizedKey = key.toLowerCase().trim();
                            const field = COLUMN_MAP[normalizedKey];
                            if (field) {
                                if (['costPrice', 'retailPrice', 'costPaid', 'retailPaid'].includes(field)) {
                                    (mapped as Record<string, unknown>)[field] = parseFloat(value) || 0;
                                } else {
                                    (mapped as Record<string, unknown>)[field] = value?.trim() || '';
                                }
                            }
                        });
                        return {
                            tourName: mapped.tourName || 'Untitled Tour',
                            date: mapped.date || new Date().toISOString().split('T')[0],
                            customerName: mapped.customerName || 'Unknown',
                            customerEmail: mapped.customerEmail,
                            costPrice: mapped.costPrice || 0,
                            retailPrice: mapped.retailPrice || 0,
                            costPaid: mapped.costPaid || 0,
                            retailPaid: mapped.retailPaid || 0,
                            status: mapped.status || 'upcoming',
                            notes: mapped.notes,
                        };
                    });
                    if (rows.length === 0) {
                        setError('No valid rows found in the file.');
                    } else {
                        setPreview(rows);
                    }
                } catch {
                    setError('Failed to parse file. Please check the format.');
                }
            },
            error: () => setError('Failed to read file.'),
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file) parseFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
    };

    const handleImport = () => {
        const tours: Omit<Tour, 'id'>[] = preview.map(r => ({
            ...r,
            status: (['upcoming', 'completed', 'cancelled'].includes(r.status) ? r.status : 'upcoming') as Tour['status'],
        }));
        onImport(tours);
    };

    const fmt = (n: number) => '$' + n.toFixed(2);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Import Tour Data</h2>
                    <button className="btn btn-ghost" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {preview.length === 0 ? (
                        <>
                            <div
                                className={`upload-area ${dragover ? 'dragover' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragover(true); }}
                                onDragLeave={() => setDragover(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload size={40} />
                                <p>Drag & drop a CSV file here, or click to browse</p>
                                <span>Supports CSV files with columns: Tour Name, Date, Customer, Cost Price, Retail Price, etc.</span>
                                <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileSelect} style={{ display: 'none' }} />
                            </div>
                            {error && (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--accent-red)', fontSize: '14px' }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                <p style={{ marginBottom: '8px' }}><FileSpreadsheet size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    Expected CSV columns (case-insensitive):</p>
                                <code style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    Tour Name, Date, Customer, Email, Cost Price, Retail Price, Cost Paid, Retail Paid, Status, Notes
                                </code>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)' }}>
                                <FileSpreadsheet size={20} />
                                <span>{preview.length} tours found — review below before importing</span>
                            </div>
                            <div className="table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tour Name</th>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Cost</th>
                                            <th>Retail</th>
                                            <th>Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((r, i) => (
                                            <tr key={i}>
                                                <td>{r.tourName}</td>
                                                <td>{r.date}</td>
                                                <td>{r.customerName}</td>
                                                <td>{fmt(r.costPrice)}</td>
                                                <td>{fmt(r.retailPrice)}</td>
                                                <td className={r.retailPrice - r.costPrice >= 0 ? 'text-green' : 'text-red'}>
                                                    {fmt(r.retailPrice - r.costPrice)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    {preview.length > 0 && (
                        <button className="btn btn-secondary" onClick={() => setPreview([])}>Back</button>
                    )}
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    {preview.length > 0 && (
                        <button className="btn btn-primary" onClick={handleImport}>
                            Import {preview.length} Tours
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
