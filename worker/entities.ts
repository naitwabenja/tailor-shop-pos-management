import { IndexedEntity } from "./core-utils";
import type { Customer, Order, MeasurementRecord, Garment, OrderItem, Payment, InventoryItem } from "@shared/types";
import { MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_GARMENTS, MOCK_INVENTORY } from "@shared/mock-data";
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = {
    id: "",
    name: "",
    email: "",
    phone: "",
    measurements: {},
    createdAt: 0,
    updatedAt: 0
  };
  static seedData = MOCK_CUSTOMERS;
  async softDelete(): Promise<void> {
    await this.mutate(s => ({ ...s, deletedAt: Date.now() }));
  }
}
export class MeasurementEntity extends IndexedEntity<MeasurementRecord> {
  static readonly entityName = "measurement";
  static readonly indexName = "measurements";
  static readonly initialState: MeasurementRecord = {
    id: "",
    customerId: "",
    values: {},
    createdAt: 0,
    updatedAt: 0
  };
  static async getLatestForCustomer(env: any, customerId: string): Promise<MeasurementRecord | null> {
    const list = await this.list(env);
    const filtered = list.items
      .filter(m => m.customerId === customerId && !m.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt);
    return filtered[0] || null;
  }
}
export class InventoryItemEntity extends IndexedEntity<InventoryItem> {
  static readonly entityName = "inventory_item";
  static readonly indexName = "inventory_items";
  static readonly initialState: InventoryItem = {
    id: "",
    name: "",
    type: 'Supply',
    quantity: 0,
    unit: "pcs",
    unitPrice: 0,
    lowStockThreshold: 5,
    createdAt: 0,
    updatedAt: 0
  };
  static seedData = MOCK_INVENTORY;
}
export class GarmentEntity extends IndexedEntity<Garment> {
  static readonly entityName = "garment";
  static readonly indexName = "garments";
  static readonly initialState: Garment = {
    id: "",
    name: "",
    basePrice: 0,
    createdAt: 0,
    updatedAt: 0
  };
  static seedData = MOCK_GARMENTS;
}
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    customerId: "",
    customerName: "",
    items: [],
    status: 'Pending',
    total: 0,
    dueDate: 0,
    createdAt: 0,
    updatedAt: 0
  };
  static seedData = MOCK_ORDERS;
  async updateStatus(status: Order['status']): Promise<Order> {
    return await this.mutate(s => ({ ...s, status, updatedAt: Date.now() }));
  }
}
export class OrderItemEntity extends IndexedEntity<OrderItem> {
  static readonly entityName = "order_item";
  static readonly indexName = "order_items";
  static readonly initialState: OrderItem = {
    id: "",
    orderId: "",
    garmentId: "",
    garmentName: "",
    quantity: 1,
    price: 0,
    createdAt: 0,
    updatedAt: 0
  };
}
export class PaymentEntity extends IndexedEntity<Payment> {
  static readonly entityName = "payment";
  static readonly indexName = "payments";
  static readonly initialState: Payment = {
    id: "",
    orderId: "",
    amountPaid: 0,
    paymentMethod: 'Cash',
    paymentDate: 0,
    createdAt: 0,
    updatedAt: 0
  };
}