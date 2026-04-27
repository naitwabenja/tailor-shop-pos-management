import type { Customer, Order, User, Garment } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Master Tailor', createdAt: Date.now(), updatedAt: Date.now() }
];
export const MOCK_GARMENTS: Garment[] = [
  { id: 'gt1', name: 'Two-Piece Suit', basePrice: 850, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'gt2', name: 'Bespoke Shirt', basePrice: 120, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'gt3', name: 'Custom Trousers', basePrice: 200, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'gt4', name: 'Waistcoat', basePrice: 150, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'gt5', name: 'Dinner Jacket', basePrice: 600, createdAt: Date.now(), updatedAt: Date.now() },
];
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'James Harrison',
    email: 'james.h@example.com',
    phone: '555-0101',
    measurements: { chest: 42, waist: 34, shoulder: 18, sleeve: 25 },
    lastVisitAt: Date.now() - 86400000 * 5,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'c2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@example.com',
    phone: '555-0102',
    measurements: { chest: 36, waist: 28, hips: 38, length: 40 },
    lastVisitAt: Date.now() - 86400000 * 2,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15,
  }
];
export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    customerName: 'James Harrison',
    items: [
      { 
        id: 'oi1', 
        orderId: 'o1', 
        garmentId: 'gt1', 
        garmentName: 'Two-Piece Suit', 
        quantity: 1, 
        price: 850, 
        fabric: 'Italian Wool',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ],
    status: 'In Progress',
    total: 850,
    dueDate: Date.now() + 86400000 * 7,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  }
];
// Re-export for POS legacy compat
export const MOCK_GARMENT_TYPES = MOCK_GARMENTS.map(g => ({ id: g.id, name: g.name, basePrice: g.basePrice }));