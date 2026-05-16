import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, OrderEntity, MeasurementEntity, InventoryItemEntity, GarmentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { OrderStatus, InventoryItem, Measurements } from "@shared/types";
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
  app.post('/api/measurements/import', async (c) => {
    try {
      const rows = await c.req.json() as any[];
      if (!Array.isArray(rows)) return bad(c, 'Expected array of measurement rows');
      const { items: customers } = await CustomerEntity.list(c.env);
      const results = { success: 0, failed: 0, errors: [] as string[] };
      const now = Date.now();
      for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        try {
          const rowName = String(row.customerName || row.name || "").trim().toLowerCase();
          const rowPhone = String(row.phone || "").trim();
          const customer = customers.find(cust =>
            cust.id === row.customerId ||
            (rowPhone && cust.phone.trim() === rowPhone) ||
            (rowName && cust.name.trim().toLowerCase() === rowName)
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
    } catch (e) {
      console.error('[API] Import Failed:', e);
      return bad(c, 'Critical failure during batch import');
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
      const sanitized = {
        ...data,
        quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
        unitPrice: data.unitPrice !== undefined ? Number(data.unitPrice) : undefined,
        lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : undefined,
      };
      const updated = await entity.mutate(s => ({ ...s, ...sanitized, updatedAt: Date.now() }));
      return ok(c, updated);
    } catch (e) {
      console.error('[API] Update Inventory Failed:', e);
      return bad(c, 'Failed to refine stock details');
    }
  });
  app.delete('/api/inventory/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const existed = await InventoryItemEntity.delete(c.env, id);
      if (!existed) return notFound(c, 'item not found');
      return ok(c, { id, deleted: true });
    } catch (e) {
      console.error('[API] Delete Inventory Failed:', e);
      return bad(c, 'Failed to archive workshop material');
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