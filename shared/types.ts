export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type OrderStatus = 'Pending' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';
export interface Measurements {
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  length?: number;
  [key: string]: number | undefined;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  measurements: Measurements;
  lastVisitAt?: number;
  createdAt: number;
}
export interface GarmentItem {
  id: string;
  type: string; // e.g., 'Suit', 'Shirt', 'Trousers'
  fabric?: string;
  notes?: string;
  price: number;
}
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: GarmentItem[];
  status: OrderStatus;
  total: number;
  dueDate: number;
  createdAt: number;
}
export interface User {
  id: string;
  name: string;
}