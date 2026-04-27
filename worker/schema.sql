-- Formal 3NF Relational Schema for Stitch POS
-- Reference for future Hyperdrive/PostgreSQL Migration
-- ENUMS
CREATE TYPE order_status AS ENUM ('Pending', 'In Progress', 'Ready', 'Delivered', 'Cancelled');
CREATE TYPE payment_method AS ENUM ('Cash', 'Mobile Money', 'Card');
-- TABLES
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE garments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    neck NUMERIC(5, 2),
    chest NUMERIC(5, 2),
    waist NUMERIC(5, 2),
    hips NUMERIC(5, 2),
    shoulder NUMERIC(5, 2),
    sleeve_length NUMERIC(5, 2),
    inseam NUMERIC(5, 2),
    total_length NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status order_status NOT NULL DEFAULT 'Pending',
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivery_date TIMESTAMPTZ NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    garment_id UUID REFERENCES garments(id), -- Nullable if custom/one-off
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_sale NUMERIC(12, 2) NOT NULL,
    fabric_notes TEXT,
    design_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    amount_paid NUMERIC(12, 2) NOT NULL CHECK (amount_paid >= 0),
    payment_method payment_method NOT NULL DEFAULT 'Cash',
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- INDEXES
CREATE INDEX idx_customers_phone ON customers(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_measurements_customer ON measurements(customer_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery ON orders(delivery_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);