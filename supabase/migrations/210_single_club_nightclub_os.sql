-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 210
-- Domain: Single Club Operating Model (Nightclub OS), Events & Work Areas
-- ============================================================================

BEGIN;

-- 1. Club Events (Master operational containers for all shifts, sales, and stock)
CREATE TABLE IF NOT EXISTS public.club_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    opening_time TEXT DEFAULT '20:00',
    closing_time TEXT DEFAULT '04:00',
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'closed')),
    assigned_staff_count INTEGER DEFAULT 0,
    gross_revenue NUMERIC(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_club_events_status_date ON public.club_events(status, event_date DESC);

-- 2. Nightclub Work Areas (Assigned operational bar stations and storerooms)
CREATE TABLE IF NOT EXISTS public.work_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_name TEXT NOT NULL UNIQUE,
    area_type TEXT NOT NULL CHECK (area_type IN ('bar', 'storeroom', 'kitchen', 'cashier', 'office')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Active Shift Sessions (Links User -> Shift -> Event -> Work Area)
CREATE TABLE IF NOT EXISTS public.active_shift_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    event_id UUID REFERENCES public.club_events(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    work_area TEXT NOT NULL REFERENCES public.work_areas(area_name) ON UPDATE CASCADE,
    device_info TEXT DEFAULT 'POS Terminal #1 (Windows)',
    shift_started_at TIMESTAMPTZ DEFAULT NOW(),
    shift_closed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_active_shifts_event_area ON public.active_shift_sessions(event_id, work_area, status);

-- 4. Add Event and Work Area context columns to core transaction tables
ALTER TABLE public.inventory_movements 
ADD COLUMN IF NOT EXISTS event_name TEXT,
ADD COLUMN IF NOT EXISTS work_area TEXT;

-- 5. Seed Default Nightclub Work Areas
INSERT INTO public.work_areas (id, area_name, area_type, is_active)
VALUES 
    (gen_random_uuid(), 'Main Bar', 'bar', true),
    (gen_random_uuid(), 'VIP Bar', 'bar', true),
    (gen_random_uuid(), 'Rooftop Bar', 'bar', true),
    (gen_random_uuid(), 'Lounge Bar', 'bar', true),
    (gen_random_uuid(), 'Stock Room', 'storeroom', true),
    (gen_random_uuid(), 'Cold Room', 'storeroom', true),
    (gen_random_uuid(), 'Entrance Cashier', 'cashier', true)
ON CONFLICT (area_name) DO NOTHING;

-- 6. Seed Scheduled & Live Club Events
INSERT INTO public.club_events (id, event_name, event_date, opening_time, closing_time, status, assigned_staff_count, gross_revenue, notes)
VALUES 
    (gen_random_uuid(), 'Friday Night Sessions (Mega Reggae)', CURRENT_DATE, '20:00', '04:00', 'live', 6, 24850.00, 'Main venue DJ lineup. High cider and tequila anticipation.'),
    (gen_random_uuid(), 'Saturday Exclusive VIP Launch', CURRENT_DATE + INTERVAL '1 day', '21:00', '05:00', 'scheduled', 8, 0.00, 'VIP guestlist bottle service priority.'),
    (gen_random_uuid(), 'Sunday Sunset Rooftop Lounge', CURRENT_DATE + INTERVAL '2 days', '15:00', '23:00', 'scheduled', 4, 0.00, 'Cocktail specials and gin buckets.')
ON CONFLICT DO NOTHING;

COMMIT;
