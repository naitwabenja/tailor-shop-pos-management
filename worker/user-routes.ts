import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, OrderEntity, MeasurementEntity, GarmentEntity, OrderItemEntity, PaymentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { OrderStatus, PaymentMethod } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const { items, next } = await CustomerEntity.list(c.env);
    // Join latest measurements for each active customer
    const activeCustomers = await Promise.all(
      items
        .filter(cust => !cust.deletedAt)
        .map(async (cust) => {
          const latest = await MeasurementEntity.getLatestForCustomer(c.env, cust.id);
          return { ...cust, measurements: latest?.values || {} };
        })
    );
    return ok(c, { items: activeCustomers, next });
  });
  app.post('/api/customers', async (c) => {
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
    // Create initial measurement record if provided
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
  });
  // GARMENTS (Products)
  app.get('/api/garments', async (c) => {
    await GarmentEntity.ensureSeed(c.env);
    const list = await GarmentEntity.list(c.env);
    return ok(c, list.items.filter(g => !g.deletedAt));
  });
  // ORDERS
  app.get('/api/orders', async (c) => {
    await OrderEntity.ensureSeed(c.env);
    const { items, next } = await OrderEntity.list(c.env);
    const activeOrders = items.filter(o => !o.deletedAt);
    return ok(c, { items: activeOrders, next });
  });
  app.post('/api/orders', async (c) => {
    const data = await c.req.json();
    if (!data.customerId || !data.items?.length) return bad(c, 'customerId and items required');
    const now = Date.now();
    const orderId = crypto.randomUUID();
    // Create Order Items
    const orderItems = await Promise.all(data.items.map(async (item: any) => {
      const oi = {
        id: crypto.randomUUID(),
        orderId,
        garmentId: item.garmentId || 'custom',
        garmentName: item.type,
        quantity: 1,
        price: item.price,
        fabric: item.fabric,
        notes: item.notes,
        createdAt: now,
        updatedAt: now
      };
      return await OrderItemEntity.create(c.env, oi);
    }));
    // Create Order
    const order = {
      id: orderId,
      customerId: data.customerId,
      customerName: data.customerName,
      items: orderItems,
      status: 'Pending' as OrderStatus,
      total: data.total,
      dueDate: data.dueDate || (now + 86400000 * 14),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    const createdOrder = await OrderEntity.create(c.env, order);
    // Create Payment Record (Simulated)
    await PaymentEntity.create(c.env, {
      id: crypto.randomUUID(),
      orderId,
      amountPaid: data.total,
      paymentMethod: (data.paymentMethod || 'Cash') as PaymentMethod,
      paymentDate: now,
      createdAt: now,
      updatedAt: now
    });
    return ok(c, createdOrder);
  });
  app.put('/api/orders/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = (await c.req.json()) as { status: OrderStatus };
    const order = new OrderEntity(c.env, id);
    if (!await order.exists()) return notFound(c, 'order not found');
    return ok(c, await order.updateStatus(status));
  });
  // SOFT DELETES
  app.delete('/api/customers/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new CustomerEntity(c.env, id);
    if (await entity.exists()) {
      await entity.softDelete();
      return ok(c, { id, deleted: true });
    }
    return notFound(c);
  });
  app.delete('/api/orders/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new OrderEntity(c.env, id);
    if (await entity.exists()) {
      await entity.mutate(s => ({ ...s, deletedAt: Date.now() }));
      return ok(c, { id, deleted: true });
    }
    return notFound(c);
  });
}