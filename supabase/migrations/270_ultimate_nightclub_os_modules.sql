-- ============================================================================
-- StockBru Enterprise Nightclub OS — Migration 270
-- Domain: Definitive Nightclub Operating Modules, Lifecycles, & Live Board
-- ============================================================================

BEGIN;

-- 1. Smart Waste & Loss Reasons Table
CREATE TABLE IF NOT EXISTS public.waste_logs (
    id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
    bottle_name VARCHAR(100) NOT NULL,
    qty_lost DECIMAL(10,2) NOT NULL,
    loss_reason VARCHAR(50) NOT NULL, -- 'Broken', 'Spillage', 'Expired', 'Staff Error', 'Customer Complaint', 'Promotional Use', 'Management Use'
    logged_by VARCHAR(100) DEFAULT 'Peter Manager',
    incident_time TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 2. Equipment Maintenance & Temperature Logs
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
    id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL, -- e.g. 'Main Bar Fridge', 'Cold Room Reserve'
    issue_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Reported', -- 'Reported', 'Technician Assigned', 'Resolved'
    technician_contact VARCHAR(100),
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.temperature_logs (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    temp_celsius DECIMAL(5,2) NOT NULL,
    status_alarm VARCHAR(50) DEFAULT 'Normal', -- 'Normal', 'Warning High', 'Critical High'
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. End-of-Night Closing Wizard Audit Trail
CREATE TABLE IF NOT EXISTS public.closing_wizard_audits (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    closed_by VARCHAR(100) NOT NULL,
    step_sales_stopped BOOLEAN DEFAULT true,
    step_bottles_closed BOOLEAN DEFAULT true,
    step_reconciliation_done BOOLEAN DEFAULT true,
    step_counts_verified BOOLEAN DEFAULT true,
    variance_net_value DECIMAL(12,2) DEFAULT 0.00,
    adjustments_approved BOOLEAN DEFAULT true,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Chrome-like Saved Workspace Views & User Favorites
CREATE TABLE IF NOT EXISTS public.user_saved_views (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    view_name VARCHAR(100) NOT NULL, -- e.g. 'Weekend Prep', 'VIP Fast Sellers'
    filter_config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_favorites (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'product', 'report', 'supplier', 'location', 'task'
    item_id VARCHAR(100) NOT NULL,
    item_label VARCHAR(100) NOT NULL
);

-- Seed Initial Data
INSERT INTO public.waste_logs (bottle_name, qty_lost, loss_reason, logged_by, notes)
VALUES
    ('Moët & Chandon Imperial', 1, 'Broken', 'Ashley Bartender', 'Dropped during VIP table presentation sparkler setup'),
    ('Windhoek Draught (440ml)', 3, 'Spillage', 'John Cashier', 'Overpoured keg line foam spillage at Main Bar'),
    ('Cîroc Red Berry', 0.5, 'Promotional Use', 'Peter Manager', 'Complimentary VIP booth tasting shots for celebrity host')
ON CONFLICT DO NOTHING;

INSERT INTO public.maintenance_logs (equipment_name, issue_type, status, technician_contact)
VALUES
    ('VIP Lounge Freezer', 'Compressor icing up & making buzzing noise', 'Technician Assigned', 'CoolTech Namibia (+264 81 123 4567)'),
    ('Main Bar Display Fridge', 'Internal LED light strip flickering', 'Reported', 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO public.temperature_logs (location_name, temp_celsius, status_alarm)
VALUES
    ('Main Bar Fridge', 3.2, 'Normal'),
    ('Cold Room Reserve', 2.8, 'Normal'),
    ('VIP Wine Display', 14.5, 'Normal'),
    ('VIP Lounge Freezer', 8.4, 'Warning High')
ON CONFLICT DO NOTHING;

COMMIT;
