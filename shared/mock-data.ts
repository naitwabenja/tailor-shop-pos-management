import type { Customer, Order, GarmentItem, User } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Master Tailor' }
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
  },
  {
    id: 'c2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@example.com',
    phone: '555-0102',
    measurements: { chest: 36, waist: 28, hips: 38, length: 40 },
    lastVisitAt: Date.now() - 86400000 * 2,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'c3',
    name: 'Robert Chen',
    email: 'rchen@example.com',
    phone: '555-0103',
    measurements: { neck: 16, sleeve: 33, chest: 40 },
    lastVisitAt: Date.now() - 86400000 * 10,
    createdAt: Date.now() - 86400000 * 60,
  }
];
export const MOCK_GARMENT_TYPES = [
  { id: 'gt1', name: 'Two-Piece Suit', basePrice: 850 },
  { id: 'gt2', name: 'Bespoke Shirt', basePrice: 120 },
  { id: 'gt3', name: 'Custom Trousers', basePrice: 200 },
  { id: 'gt4', name: 'Waistcoat', basePrice: 150 },
  { id: 'gt5', name: 'Dinner Jacket', basePrice: 600 },
];
export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    customerName: 'James Harrison',
    items: [{ id: 'i1', type: 'Two-Piece Suit', price: 850, fabric: 'Italian Wool' }],
    status: 'In Progress',
    total: 850,
    dueDate: Date.now() + 86400000 * 7,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'o2',
    customerId: 'c2',
    customerName: 'Sarah Jenkins',
    items: [{ id: 'i2', type: 'Custom Trousers', price: 200, notes: 'Slim fit' }],
    status: 'Pending',
    total: 200,
    dueDate: Date.now() + 86400000 * 4,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'o3',
    customerId: 'c3',
    customerName: 'Robert Chen',
    items: [{ id: 'i3', type: 'Bespoke Shirt', price: 120, fabric: 'Sea Island Cotton' }],
    status: 'Ready',
    total: 120,
    dueDate: Date.now() - 86400000 * 1,
    createdAt: Date.now() - 86400000 * 10,
  }
];