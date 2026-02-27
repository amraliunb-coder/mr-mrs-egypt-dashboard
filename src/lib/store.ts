'use client';

import { v4 as uuidv4 } from 'uuid';
import { Tour, TourWithComputed, DashboardSummary, MonthlyData, CustomerSummary } from './types';
import { format, parseISO } from 'date-fns';
import { SEED_TOURS } from './seedData';

const STORAGE_KEY = 'mme_tours';
const SEEDED_KEY = 'mme_seeded';

// --- Computed Fields ---
export function computeTourFields(tour: Tour): TourWithComputed {
    const costRemaining = Math.max(0, tour.costPrice - tour.costPaid);
    const retailRemaining = Math.max(0, tour.retailPrice - tour.retailPaid);
    const profit = tour.retailPrice - tour.costPrice;
    const marginPercent = tour.retailPrice > 0 ? (profit / tour.retailPrice) * 100 : 0;
    return { ...tour, costRemaining, retailRemaining, profit, marginPercent };
}

// Auto-seed on first load
function ensureSeeded() {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(SEEDED_KEY)) return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing || existing === '[]') {
        const seeded: Tour[] = SEED_TOURS.map(t => ({ ...t, id: uuidv4() }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    }
    localStorage.setItem(SEEDED_KEY, 'true');
}

// --- CRUD ---
export function getTours(): TourWithComputed[] {
    if (typeof window === 'undefined') return [];
    ensureSeeded();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        const tours: Tour[] = JSON.parse(raw);
        return tours.map(computeTourFields).sort((a, b) => b.date.localeCompare(a.date));
    } catch {
        return [];
    }
}

function stripComputed(tour: TourWithComputed | Tour): Tour {
    const { id, tourName, date, customerName, customerEmail, costPrice, retailPrice, costPaid, retailPaid, notes, status } = tour;
    return { id, tourName, date, customerName, customerEmail, costPrice, retailPrice, costPaid, retailPaid, notes, status };
}

function saveTours(tours: (Tour | TourWithComputed)[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tours.map(stripComputed)));
}

export function addTour(tour: Omit<Tour, 'id'>): TourWithComputed {
    const newTour: Tour = { ...tour, id: uuidv4() };
    const tours = getTours();
    saveTours([...tours, newTour]);
    return computeTourFields(newTour);
}

export function updateTour(id: string, updates: Partial<Tour>): TourWithComputed | null {
    const tours = getTours();
    const idx = tours.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const updated: Tour = stripComputed({ ...tours[idx], ...updates });
    tours[idx] = computeTourFields(updated);
    saveTours(tours);
    return computeTourFields(updated);
}

export function deleteTour(id: string): boolean {
    const tours = getTours();
    const filtered = tours.filter(t => t.id !== id);
    if (filtered.length === tours.length) return false;
    saveTours(filtered);
    return true;
}

export function importTours(newTours: Omit<Tour, 'id'>[]): number {
    const existing = getTours();
    const withIds: Tour[] = newTours.map(t => ({ ...t, id: uuidv4() }));
    saveTours([...existing, ...withIds]);
    return withIds.length;
}

// --- Aggregations ---
export function getDashboardSummary(tours?: TourWithComputed[]): DashboardSummary {
    const data = tours ?? getTours();
    const totalRevenue = data.reduce((s, t) => s + t.retailPrice, 0);
    const totalCosts = data.reduce((s, t) => s + t.costPrice, 0);
    const totalProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const totalCostPaid = data.reduce((s, t) => s + t.costPaid, 0);
    const totalCostRemaining = data.reduce((s, t) => s + t.costRemaining, 0);
    const totalRetailPaid = data.reduce((s, t) => s + t.retailPaid, 0);
    const totalRetailRemaining = data.reduce((s, t) => s + t.retailRemaining, 0);
    return {
        totalRevenue, totalCosts, totalProfit, profitMargin,
        totalBookings: data.length,
        totalCostPaid, totalCostRemaining,
        totalRetailPaid, totalRetailRemaining,
    };
}

export function getMonthlyData(tours?: TourWithComputed[]): MonthlyData[] {
    const data = tours ?? getTours();
    const map = new Map<string, MonthlyData>();
    data.forEach(t => {
        try {
            const month = format(parseISO(t.date), 'MMM yyyy');
            const existing = map.get(month) || { month, revenue: 0, costs: 0, profit: 0 };
            existing.revenue += t.retailPrice;
            existing.costs += t.costPrice;
            existing.profit += t.retailPrice - t.costPrice;
            map.set(month, existing);
        } catch { /* skip invalid dates */ }
    });
    return Array.from(map.values());
}

export function getCustomers(tours?: TourWithComputed[]): CustomerSummary[] {
    const data = tours ?? getTours();
    const map = new Map<string, CustomerSummary>();
    data.forEach(t => {
        const key = t.customerName.toLowerCase().trim();
        const existing = map.get(key) || {
            name: t.customerName,
            email: t.customerEmail,
            totalBookings: 0, totalRevenue: 0, totalProfit: 0,
            lastTourDate: t.date, tours: [],
        };
        existing.totalBookings++;
        existing.totalRevenue += t.retailPrice;
        existing.totalProfit += t.profit;
        if (t.date > existing.lastTourDate) existing.lastTourDate = t.date;
        if (t.customerEmail && !existing.email) existing.email = t.customerEmail;
        existing.tours.push(t);
        map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// --- Export ---
export function exportToJson(): string {
    return JSON.stringify(getTours(), null, 2);
}

export function exportToCsv(): string {
    const tours = getTours();
    if (tours.length === 0) return '';
    const headers = ['Tour Name', 'Date', 'Customer', 'Email', 'Cost Price', 'Retail Price', 'Cost Paid', 'Retail Paid', 'Cost Remaining', 'Retail Remaining', 'Profit', 'Margin %', 'Status', 'Notes'];
    const rows = tours.map(t => [
        t.tourName, t.date, t.customerName, t.customerEmail || '',
        t.costPrice, t.retailPrice, t.costPaid, t.retailPaid,
        t.costRemaining, t.retailRemaining, t.profit, t.marginPercent.toFixed(1),
        t.status, t.notes || '',
    ].map(v => `"${v}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
}
