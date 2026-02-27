export interface Tour {
    id: string;
    tourName: string;
    date: string;
    customerName: string;
    customerEmail?: string;
    costPrice: number;
    retailPrice: number;
    costPaid: number;
    retailPaid: number;
    notes?: string;
    tourLink?: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'active' | 'arrived';
    endDate: string;
}

export interface TourWithComputed extends Tour {
    costRemaining: number;
    retailRemaining: number;
    profit: number;
    marginPercent: number;
}

export interface DashboardSummary {
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
    profitMargin: number;
    totalBookings: number;
    totalCostPaid: number;
    totalCostRemaining: number;
    totalRetailPaid: number;
    totalRetailRemaining: number;
}

export interface MonthlyData {
    month: string;
    revenue: number;
    costs: number;
    profit: number;
}

export interface CustomerSummary {
    name: string;
    email?: string;
    totalBookings: number;
    totalRevenue: number;
    totalProfit: number;
    lastTourDate: string;
    tours: TourWithComputed[];
}
