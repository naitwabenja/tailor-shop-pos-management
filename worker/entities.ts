import { IndexedEntity } from "./core-utils";
import type { Customer, Order } from "@shared/types";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@shared/mock-data";
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = { 
    id: "", 
    name: "", 
    email: "", 
    phone: "", 
    measurements: {}, 
    createdAt: 0 
  };
  static seedData = MOCK_CUSTOMERS;
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
    createdAt: 0 
  };
  static seedData = MOCK_ORDERS;
  async updateStatus(status: Order['status']): Promise<Order> {
    return await this.mutate(s => ({ ...s, status }));
  }
}