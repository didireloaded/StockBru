-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 230
-- Domain: Mobile-First Touch OS, Offline Sync Queue & Handheld POS Registry
-- ============================================================================

BEGIN;

-- 1. Offline Transaction Synchronization Queue (For handheld mobile POS operation without internet)
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_tx_id TEXT NOT NULL UNIQUE,
    user_name TEXT NOT NULL,
    work_area TEXT NOT NULL,
    tx_type TEXT NOT NULL CHECK (tx_type IN ('sale', 'movement', 'open_bottle', 'stock_count', 'transfer')),
    payload JSONB NOT NULL,
    is_synced BOOLEAN DEFAULT false,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offline_queue_sync ON public.offline_sync_queue(is_synced, created_at);

-- 2. Mobile & Tablet POS Device Registry
CREATE TABLE IF NOT EXISTS public.mobile_device_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_name TEXT NOT NULL UNIQUE,
    device_type TEXT NOT NULL CHECK (device_type IN ('mobile_phone', 'tablet', 'desktop_terminal')),
    user_assigned TEXT NOT NULL,
    active_work_area TEXT NOT NULL,
    app_version TEXT DEFAULT 'v4.2 Touch OS',
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Sample Handheld POS Devices
INSERT INTO public.mobile_device_registry (id, device_name, device_type, user_assigned, active_work_area)
VALUES 
    (gen_random_uuid(), 'iPhone 15 Pro (Bartender Handheld #1)', 'mobile_phone', 'Peter Bartender', 'Main Bar'),
    (gen_random_uuid(), 'iPad Air (Manager Audit Tablet)', 'tablet', 'Pedro Manager', 'VIP Bar'),
    (gen_random_uuid(), 'Main POS Terminal (Windows)', 'desktop_terminal', 'Pedro Manager', 'Entrance Cashier')
ON CONFLICT (device_name) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_device_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access on offline queue" ON public.offline_sync_queue FOR ALL USING (true);
CREATE POLICY "Allow authenticated read on mobile registry" ON public.mobile_device_registry FOR ALL USING (true);

COMMIT;
