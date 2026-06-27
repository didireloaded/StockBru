-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 250
-- Domain: Enterprise Product Library (260+ SKUs), Authentic Brands & Demo Scenarios
-- ============================================================================

BEGIN;

ALTER TABLE public.suppliers 
    ADD COLUMN IF NOT EXISTS contact_person TEXT, 
    ADD COLUMN IF NOT EXISTS email TEXT, 
    ADD COLUMN IF NOT EXISTS phone TEXT;

-- 1. Insert Authentic Nightclub Suppliers (Namibia & Southern Africa)
INSERT INTO public.suppliers (id, name, contact_person, email, phone)
VALUES
    (1001, 'NamBev Beverage Corporation', 'Johan Van Der Merwe', 'orders@nambev.com.na', '+264 61 299 1111'),
    (1002, 'Diageo Southern Africa', 'Sipho Dlamini', 'hospitality@diageo.com', '+27 11 987 6543'),
    (1003, 'Pernod Ricard Hospitality', 'Claire Dupont', 'orders@pernod-ricard.com', '+27 21 444 8888'),
    (1004, 'Distell Group Limited', 'Hendrik Smit', 'supply@distell.co.za', '+27 21 808 3911'),
    (1005, 'Heineken Namibia Beverages', 'Markus Bauer', 'dispatch@heineken.na', '+264 61 333 5555')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Demo Scenario Configurations Table
CREATE TABLE IF NOT EXISTS public.demo_scenarios (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    multiplier_sales DECIMAL(4,2) DEFAULT 1.00,
    multiplier_pours DECIMAL(4,2) DEFAULT 1.00,
    active_event VARCHAR(100),
    is_default BOOLEAN DEFAULT false
);

INSERT INTO public.demo_scenarios (id, name, description, multiplier_sales, multiplier_pours, active_event, is_default)
VALUES
    ('quiet_tuesday', 'Quiet Tuesday Night', 'Low foot traffic, relaxed VIP lounge vibe, minimal stock depletion', 0.40, 0.30, 'Industry Workers Night', false),
    ('busy_friday', 'Busy Friday Night Sessions', 'Maximum capacity nightclub operations, rapid checkout, heavy pour velocities', 2.80, 3.20, 'Friday Night Sessions', true),
    ('ladies_night', 'Wednesday Ladies Night', 'Spike in Champagne, Sparklings, Cocktails, Pink Gin & Vodka consumption', 1.90, 2.10, 'Divas & Diamonds Ladies Night', false),
    ('concert_night', 'Live Concert & DJ Headline', 'Heavy Beer, Cider, Energy Drink & Tequila shot volume across all 4 bars', 3.50, 4.00, 'AfroTech Stadium DJ Headline', false),
    ('month_end_audit', 'Month-End Stocktake Audit', 'Storeroom audit mode active with automated variance compliance checks', 1.00, 1.00, 'Full Venue Stock Audit', false)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    multiplier_sales = EXCLUDED.multiplier_sales,
    multiplier_pours = EXCLUDED.multiplier_pours;

COMMIT;
