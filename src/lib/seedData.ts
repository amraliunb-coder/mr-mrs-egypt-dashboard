import { Tour } from './types';

// Actual tour data for Mr & Mrs Egypt
// costPaid = costPrice - costRemaining
// retailPaid = retailPrice - retailRemaining
export const SEED_TOURS: Omit<Tour, 'id'>[] = [
    {
        tourName: 'Egypt Tour',
        date: '2026-02-26',
        customerName: 'Kevin Allison',
        costPrice: 6300,
        retailPrice: 6900,
        costPaid: 6300,      // remaining: 0
        retailPaid: 6900,    // remaining: 0
        status: 'upcoming',
        notes: 'Trip: 26-Feb to 13-Mar-26',
    },
    {
        tourName: 'Egypt Tour',
        date: '2026-04-09',
        customerName: 'Dinos Tornivoukas',
        costPrice: 3500,
        retailPrice: 4300,
        costPaid: 1505,      // remaining: 1995
        retailPaid: 1505,    // remaining: 2795
        status: 'upcoming',
        notes: 'Trip: 09-Apr to 14-Apr-26',
    },
    {
        tourName: 'Egypt Tour',
        date: '2026-04-13',
        customerName: 'Andy Yee',
        costPrice: 17870,
        retailPrice: 19295,
        costPaid: 4470,      // remaining: 13400
        retailPaid: 9014.25, // remaining: 10280.75
        status: 'upcoming',
        notes: 'Trip: 13-Apr to 21-Apr-26 — Egypt leg',
    },
    {
        tourName: 'Jordan Tour',
        date: '2026-04-21',
        customerName: 'Andy Yee',
        costPrice: 8800,
        retailPrice: 10460,
        costPaid: 0,         // remaining: 8800
        retailPaid: 10460,   // remaining: 0
        status: 'upcoming',
        notes: 'Trip: 21-Apr to 26-Apr-26 — Jordan leg',
    },
    {
        tourName: 'Egypt Tour',
        date: '2026-04-20',
        customerName: 'Rachel Shenker',
        costPrice: 6900,
        retailPrice: 9130,
        costPaid: 0,         // remaining: 6900
        retailPaid: 9130,    // remaining: 0
        status: 'upcoming',
        notes: 'Trip: 20-Apr to 26-Apr-26',
    },
    {
        tourName: 'Egypt Tour',
        date: '2026-05-21',
        customerName: 'Stephanie Sargent',
        costPrice: 3740,
        retailPrice: 4350,
        costPaid: 3740,      // remaining: 0
        retailPaid: 4350,    // remaining: 0
        status: 'upcoming',
        notes: 'Trip: 21-May to 02-Jun-26',
    },
    {
        tourName: 'Egypt Tour',
        date: '2027-12-20',
        customerName: 'Julie Liddy',
        costPrice: 31000,
        retailPrice: 39800,
        costPaid: 7750,      // remaining: 23250
        retailPaid: 19900,   // remaining: 19900
        status: 'upcoming',
        notes: 'Trip: 20-Dec-27 to 02-Jan-28',
    },
];
