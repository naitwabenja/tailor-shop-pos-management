export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}
export type OrderStatus = 'Pending' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Mobile Money' | 'Card';
export interface Measurements extends Record<string, number | undefined> {
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  length?: number;
}
export interface MeasurementRecord extends BaseEntity {
  customerId: string;
  values: Measurements;
  notes?: string;
}
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  measurements: Measurements; // Joined from latest MeasurementRecord for UI compatibility
  lastVisitAt?: number;
}
export interface Garment extends BaseEntity {
  name: string;
  basePrice: number;
}
export interface GarmentItem {
  id: string;
  type: string; 
  fabric?: string;
  notes?: string;
  price: number;
}
export interface OrderItem extends BaseEntity {
  orderId: string;
  garmentId: string;
  garmentName: string;
  quantity: number;
  price: number;
  fabric?: string;
  notes?: string;
}
export interface Payment extends BaseEntity {
  orderId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  paymentDate: number;
  transactionReference?: string;
}
export interface Order extends BaseEntity {
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  dueDate: number;
  notes?: string;
}
export interface User extends BaseEntity {
  name: string;
}