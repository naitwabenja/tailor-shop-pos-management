import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, OrderEntity, MeasurementEntity, InventoryItemEntity, GarmentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { OrderStatus, InventoryItem, Measurements, OrderItem } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GARMENTS
  app.get('/api/garments', async (c) => {
    try {
      await GarmentEntity.ensureSeed(c.env);
      const { items } = await GarmentEntity.list(c.env);
      return ok(c, items);
    } catch (e) {
      console.error('[API] Get Garments Failed:', e);
      return bad(c, 'Failed to retrieve garment library');
    }
  });
  app.post('/api/garments', async (c) => {
    try {
      const data = await c.req.json();
      if (!data.name?.trim()) return bad(c, 'name required');
      const now = Date.now();
      const garment = await GarmentEntity.create(c.env, {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        basePrice: Number(data.basePrice) || 0,
        createdAt: now,
        updatedAt: now
      });
      return ok(c, garment);
    } catch (e) {
      console.error('[API] Create Garment Failed:', e);
      return bad(c, 'Failed to register garment');
    }
  });
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    try {
      await CustomerEntity.ensureSeed(c.env);
      const { items, next } = await CustomerEntity.list(c.env);
      const activeCustomers = await Promise.all(
        items
          .filter(cust => !cust.deletedAt)
          .map(async (cust) => {
            const latest = await MeasurementEntity.getLatestForCustomer(c.env, cust.id);
            return { ...cust, measurements: latest?.values || {} };
          })
      );
      return ok(c, { items: activeCustomers, next });
    } catch (e) {
      console.error('[API] Get Customers Failed:', e);
      return bad(c, 'Failed to retrieve artisan registry');
    }
  });
  app.post('/api/customers', async (c) => {
    try {
      const data = await c.req.json();
      if (!data.name?.trim() || !data.phone?.trim()) return bad(c, 'name and phone required');
      const now = Date.now();
      const customer = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      };
      const created = await CustomerEntity.create(c.env, customer);
      if (data.measurements && Object.keys(data.measurements).length > 0) {
        await MeasurementEntity.create(c.env, {
          id: crypto.randomUUID(),
          customerId: created.id,
          values: data.measurements,
          createdAt: now,
          updatedAt: now
        });
      }
      return ok(c, { ...created, measurements: data.measurements || {} });
    } catch (e) {
      console.error('[API] Create Customer Failed:', e);
      return bad(c, 'Failed to formalize registry entry');
    }
  });
  // MEASUREMENTS
  app.get('/api/measurements', async (c) => {
    try {
      const { items } = await MeasurementEntity.list(c.env);
      const { items: customers } = await CustomerEntity.list(c.env);
      const mapped = items
        .filter(m => !m.deletedAt)
        .map(m => {
          const cust = customers.find(cu => cu.id === m.customerId);
          return { ...m, customerName: cust?.name || 'Unknown Client' };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
      return ok(c, mapped);
    } catch (e) {
      console.error('[API] Get Measurements Failed:', e);
      return bad(c, 'Failed to retrieve measurement archives');
    }
  });
  // INVENTORY
  app.get('/api/inventory', async (c) => {
    try {
      await InventoryItemEntity.ensureSeed(c.env);
      const { items } = await InventoryItemEntity.list(c.env);
      return ok(c, items.filter(i => !i.deletedAt));
    } catch (e) {
      console.error('[API] Get Inventory Failed:', e);
      return bad(c, 'Failed to audit workshop stock');
    }
  });
  app.post('/api/inventory', async (c) => {
    try {
      const data = await c.req.json();
      const now = Date.now();
      const item = {
        ...data,
        quantity: Number(data.quantity) || 0,
        unitPrice: Number(data.unitPrice) || 0,
        lowStockThreshold: Number(data.lowStockThreshold) || 5,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      } as InventoryItem;
      const created = await InventoryItemEntity.create(c.env, item);
      return ok(c, created);
    } catch (e) {
      console.error('[API] Create Inventory Failed:', e);
      return bad(c, 'Failed to secure stock in workshop');
    }
  });
  app.put('/api/inventory/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const data = await c.req.json();
      const entity = new InventoryItemEntity(c.env, id);
      if (!await entity.exists()) return notFound(c);
      const updated = await entity.mutate(s => ({ 
        ...s, 
        ...data, 
        quantity: data.quantity !== undefined ? Number(data.quantity) : s.quantity,
        updatedAt: Date.now() 
      }));
      return ok(c, updated);
    } catch (e) {
      console.error('[API] Update Inventory Failed:', e);
      return bad(c, 'Failed to refine stock details');
    }
  });
  // ORDERS
  app.get('/api/orders', async (c) => {
    try {
      await OrderEntity.ensureSeed(c.env);
      const { items, next } = await OrderEntity.list(c.env);
      return ok(c, { items: items.filter(o => !o.deletedAt), next });
    } catch (e) {
      console.error('[API] Get Orders Failed:', e);
      return bad(c, 'Failed to retrieve commission registry');
    }
  });
  app.post('/api/orders', async (c) => {
    try {
      const data = await c.req.json();
      if (!data.customerId || !data.items?.length) return bad(c, 'customerId and items required');
      const now = Date.now();
      const orderId = crypto.randomUUID();
      // Inventory Processing
      for (const item of data.items as OrderItem[]) {
        if (item.inventoryItemId && item.itemType === 'retail') {
          const inv = new InventoryItemEntity(c.env, item.inventoryItemId);
          if (await inv.exists()) {
            const current = await inv.getState();
            if (current.quantity < item.quantity) {
              return bad(c, `Insufficient stock for ${item.garmentName}`);
            }
            await inv.mutate(s => ({ 
              ...s, 
              quantity: s.quantity - item.quantity, 
              updatedAt: now 
            }));
          }
        }
      }
      const order = {
        id: orderId,
        customerId: data.customerId,
        customerName: data.customerName,
        items: data.items.map((it: any) => ({
          ...it,
          id: crypto.randomUUID(),
          orderId,
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 1
        })),
        status: 'Pending' as OrderStatus,
        total: Number(data.total) || 0,
        dueDate: Number(data.dueDate) || (now + 86400000 * 14),
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      };
      const createdOrder = await OrderEntity.create(c.env, order);
      return ok(c, createdOrder);
    } catch (e) {
      console.error('[API] Create Order Failed:', e);
      return bad(c, 'Failed to formalize commission');
    }
  });
  app.put('/api/orders/:id/status', async (c) => {
    try {
      const id = c.req.param('id');
      const { status } = (await c.req.json()) as { status: OrderStatus };
      const order = new OrderEntity(c.env, id);
      if (!await order.exists()) return notFound(c, 'order not found');
      return ok(c, await order.updateStatus(status));
    } catch (e) {
      console.error('[API] Update Order Status Failed:', e);
      return bad(c, 'Failed to transition commission status');
    }
  });
}