'use client';

import { useEffect, useState } from 'react';
import { getTours, getVisibleTours } from '@/lib/store';
import { TourWithComputed } from '@/lib/types';
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, addMonths, subMonths,
    isSameMonth, isToday, isSameDay, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function CalendarPage() {
    const [tours, setTours] = useState<TourWithComputed[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { user, isLoading } = useAuth();
    const isAdmin = !isLoading && user?.role === 'admin';

    useEffect(() => {
        setTours(isAdmin ? getTours() : getVisibleTours());
    }, [isAdmin]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    const getToursForDay = (day: Date) =>
        tours.filter(t => {
            try { return isSameDay(parseISO(t.date), day); } catch { return false; }
        });

    const selectedTours = selectedDate ? getToursForDay(selectedDate) : [];

    const fmt = (n: number) => '$' + n.toFixed(2);

    return (
        <>
            <div className="page-header">
                <h1>Calendar</h1>
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="calendar-header-cell">{d}</div>
                    ))}
                    {days.map((day, i) => {
                        const dayTours = getToursForDay(day);
                        const inMonth = isSameMonth(day, currentMonth);
                        const today = isToday(day);
                        const selected = selectedDate && isSameDay(day, selectedDate);
                        return (
                            <div
                                key={i}
                                className={`calendar-cell ${!inMonth ? 'other-month' : ''} ${today ? 'today' : ''}`}
                                style={selected ? { borderColor: 'var(--gold-primary)', background: 'rgba(212,168,67,0.06)' } : {}}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="calendar-date">{format(day, 'd')}</div>
                                {dayTours.slice(0, 3).map(t => (
                                    <div key={t.id} className="calendar-tour-dot">{t.tourName}</div>
                                ))}
                                {dayTours.length > 3 && (
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        +{dayTours.length - 3} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <div className="card">
                    <h3 className="section-title">
                        <CalendarDays size={20} />
                        Tours on {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    {selectedTours.length === 0 ? (
                        <div className="empty-state" style={{ padding: '24px' }}>
                            <p>No tours scheduled for this date</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tour Name</th>
                                        <th>Customer</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Cost</th>
                                        <th>Retail</th>
                                        <th>Profit</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTours.map(t => (
                                        <tr key={t.id}>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.tourName}</td>
                                            <td>{t.customerName}</td>
                                            <td>{t.date}</td>
                                            <td>{t.endDate || t.date}</td>
                                            <td>{fmt(t.costPrice)}</td>
                                            <td>{fmt(t.retailPrice)}</td>
                                            <td className={t.profit >= 0 ? 'text-green' : 'text-red'}>{fmt(t.profit)}</td>
                                            <td><span className={`status-badge status-${t.status}`}>{t.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
