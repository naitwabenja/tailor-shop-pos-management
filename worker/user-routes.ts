import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, OrderEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { OrderStatus } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await CustomerEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/customers', async (c) => {
    const data = await c.req.json();
    if (!data.name?.trim() || !data.phone?.trim()) return bad(c, 'name and phone required');
    const customer = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      measurements: data.measurements || {}
    };
    return ok(c, await CustomerEntity.create(c.env, customer));
  });
  // ORDERS
  app.get('/api/orders', async (c) => {
    await OrderEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await OrderEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/orders', async (c) => {
    const data = await c.req.json();
    if (!data.customerId || !data.items?.length) return bad(c, 'customerId and items required');
    const order = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: 'Pending'
    };
    return ok(c, await OrderEntity.create(c.env, order));
  });
  app.put('/api/orders/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = (await c.req.json()) as { status: OrderStatus };
    const order = new OrderEntity(c.env, id);
    if (!await order.exists()) return notFound(c, 'order not found');
    return ok(c, await order.updateStatus(status));
  });
  // DELETE
  app.delete('/api/customers/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await CustomerEntity.delete(c.env, c.req.param('id')) }));
  app.delete('/api/orders/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await OrderEntity.delete(c.env, c.req.param('id')) }));
}