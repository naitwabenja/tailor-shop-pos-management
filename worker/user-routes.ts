import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, OrderEntity, MeasurementEntity, GarmentEntity, OrderItemEntity, PaymentEntity, InventoryItemEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { OrderStatus, PaymentMethod, InventoryItem, Measurements } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
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
  // MEASUREMENTS
  app.get('/api/measurements', async (c) => {
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
  });
  app.post('/api/measurements/import', async (c) => {
    const rows = await c.req.json() as any[];
    if (!Array.isArray(rows)) return bad(c, 'Expected array of measurement rows');
    const { items: customers } = await CustomerEntity.list(c.env);
    const results = { success: 0, failed: 0, errors: [] as string[] };
    const now = Date.now();
    for (const row of rows) {
      try {
        // Match customer by ID, Phone (exact), or Name (fuzzy)
        const customer = customers.find(cust => 
          cust.id === row.customerId || 
          cust.phone === row.phone || 
          cust.name.toLowerCase() === (row.customerName || row.name || "").toLowerCase()
        );
        if (!customer) {
          results.failed++;
          results.errors.push(`Customer not found for row: ${row.customerName || row.name || 'Unknown'}`);
          continue;
        }
        const measurements: Measurements = {
          neck: parseFloat(row.neck) || undefined,
          chest: parseFloat(row.chest) || undefined,
          waist: parseFloat(row.waist) || undefined,
          hips: parseFloat(row.hips) || undefined,
          shoulder: parseFloat(row.shoulder) || undefined,
          sleeve: parseFloat(row.sleeve) || undefined,
          inseam: parseFloat(row.inseam) || undefined,
          length: parseFloat(row.length) || undefined,
        };
        await MeasurementEntity.create(c.env, {
          id: crypto.randomUUID(),
          customerId: customer.id,
          values: measurements,
          notes: row.notes || "Imported via CSV",
          createdAt: row.date ? new Date(row.date).getTime() : now,
          updatedAt: now
        });
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Error processing row: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    return ok(c, results);
  });
  // INVENTORY
  app.get('/api/inventory', async (c) => {
    await InventoryItemEntity.ensureSeed(c.env);
    const { items } = await InventoryItemEntity.list(c.env);
    return ok(c, items.filter(i => !i.deletedAt));
  });
  app.post('/api/inventory', async (c) => {
    const data = await c.req.json();
    const now = Date.now();
    const item = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    } as InventoryItem;
    const created = await InventoryItemEntity.create(c.env, item);
    return ok(c, created);
  });
  app.put('/api/inventory/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    const entity = new InventoryItemEntity(c.env, id);
    if (!await entity.exists()) return notFound(c);
    const updated = await entity.mutate(s => ({ ...s, ...data, updatedAt: Date.now() }));
    return ok(c, updated);
  });
  app.delete('/api/inventory/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new InventoryItemEntity(c.env, id);
    if (!await entity.exists()) return notFound(c);
    await entity.mutate(s => ({ ...s, deletedAt: Date.now() }));
    return ok(c, { id, deleted: true });
  });
  // GARMENTS
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
    if (data.notes) {
      try {
        const parsed = JSON.parse(data.notes);
        if (parsed.measurements && Object.keys(parsed.measurements).length > 0) {
          await MeasurementEntity.create(c.env, {
            id: crypto.randomUUID(),
            customerId: data.customerId,
            values: parsed.measurements,
            createdAt: now,
            updatedAt: now
          });
        }
      } catch (e) {
        console.error('[ORDER API] Failed to parse measurement notes:', e);
      }
    }
    const orderItems = await Promise.all(data.items.map(async (item: any) => {
      const oi = {
        id: crypto.randomUUID(),
        orderId,
        garmentId: item.garmentId || 'custom',
        garmentName: item.type || item.garmentName,
        quantity: 1,
        price: item.price,
        fabric: item.fabric,
        notes: item.notes,
        createdAt: now,
        updatedAt: now
      };
      return await OrderItemEntity.create(c.env, oi);
    }));
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
  app.delete('/api/customers/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new CustomerEntity(c.env, id);
    if (await entity.exists()) {
      await entity.mutate(s => ({ ...s, deletedAt: Date.now() }));
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