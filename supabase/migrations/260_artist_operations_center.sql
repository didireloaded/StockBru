-- ============================================================================
-- StockBru Enterprise Nightclub OS — Migration 260
-- Domain: Flagship Artist Operations Center & Rider Fulfillment System
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.artist_bookings (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
    artist_name VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Event Ready',
    arrival_time VARCHAR(20) DEFAULT '18:00',
    performance_time VARCHAR(20) DEFAULT '22:30',
    departure_time VARCHAR(20) DEFAULT '01:00',
    assigned_manager VARCHAR(100) DEFAULT 'Peter',
    assigned_bar VARCHAR(100) DEFAULT 'VIP Bar',
    readiness_score INTEGER DEFAULT 96,
    historical_plays INTEGER DEFAULT 12,
    avg_rider_value DECIMAL(10,2) DEFAULT 18000.00,
    preferred_green_room VARCHAR(50) DEFAULT 'VIP 2',
    management_contact VARCHAR(100) DEFAULT 'John Smith (+27 82 555 1234)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.artist_rider_items (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES public.artist_bookings(id) ON DELETE CASCADE,
    bottle_name VARCHAR(100) NOT NULL,
    requested_qty INTEGER NOT NULL,
    available_qty INTEGER NOT NULL,
    reserved_qty INTEGER NOT NULL,
    missing_qty INTEGER DEFAULT 0,
    storage_location VARCHAR(100) DEFAULT 'VIP Storeroom',
    status_badge VARCHAR(50) DEFAULT 'ready', -- 'ready', 'missing', 'ordered'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.green_room_checklists (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES public.artist_bookings(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT true,
    assigned_to VARCHAR(100) DEFAULT 'Ashley',
    completed_at VARCHAR(20) DEFAULT '17:42'
);

CREATE TABLE IF NOT EXISTS public.artist_timeline_events (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) REFERENCES public.artist_bookings(id) ON DELETE CASCADE,
    time_str VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    status_type VARCHAR(50) DEFAULT 'done' -- 'done', 'current', 'future'
);

-- Seed Initial Headline Booking: DJ Black Coffee
INSERT INTO public.artist_bookings (id, artist_name, event_name, event_date, status, arrival_time, performance_time, departure_time, assigned_manager, assigned_bar, readiness_score)
VALUES ('booking_black_coffee_01', 'DJ Black Coffee', 'Friday Night Sessions', '28 July 2026', 'Event Ready', '18:00', '22:30', '01:00', 'Peter Manager', 'VIP Bar', 96)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.artist_rider_items (booking_id, bottle_name, requested_qty, available_qty, reserved_qty, missing_qty, storage_location, status_badge)
VALUES
    ('booking_black_coffee_01', 'Cîroc Original', 4, 8, 4, 0, 'VIP Storeroom', 'ready'),
    ('booking_black_coffee_01', 'Moët & Chandon Imperial', 6, 4, 4, 2, 'Cold Room Reserve', 'missing'),
    ('booking_black_coffee_01', 'Red Bull Energy (250ml)', 24, 120, 24, 0, 'VIP Storeroom', 'ready'),
    ('booking_black_coffee_01', 'San Pellegrino Sparkling', 12, 30, 12, 0, 'VIP Fridge', 'ready')
ON CONFLICT DO NOTHING;

INSERT INTO public.green_room_checklists (booking_id, item_name, is_completed, assigned_to, completed_at)
VALUES
    ('booking_black_coffee_01', 'Water (Aqua Splash & San Pellegrino)', true, 'Ashley', '17:15'),
    ('booking_black_coffee_01', 'Crushed Ice & Silver Bucket', true, 'Ashley', '17:20'),
    ('booking_black_coffee_01', 'Fresh Towels (Black Cotton)', true, 'Ashley', '17:25'),
    ('booking_black_coffee_01', 'Fruit Platter (Organic Berries)', true, 'Ashley', '17:30'),
    ('booking_black_coffee_01', 'Gourmet Snacks & Charcuterie', true, 'Ashley', '17:35'),
    ('booking_black_coffee_01', 'Champagne Flutes & Crystal Rock Glasses', true, 'Ashley', '17:40'),
    ('booking_black_coffee_01', 'Spirits & Premium Mixers Setup', true, 'Ashley', '17:42'),
    ('booking_black_coffee_01', 'Stage White Lilies Arrangement', true, 'Ashley', '17:42')
ON CONFLICT DO NOTHING;

INSERT INTO public.artist_timeline_events (booking_id, time_str, title, status_type)
VALUES
    ('booking_black_coffee_01', '09:00', 'Artist Headline Contract Booked', 'done'),
    ('booking_black_coffee_01', '09:15', 'Hospitality & Beverage Rider Uploaded', 'done'),
    ('booking_black_coffee_01', '09:20', 'Smart Inventory Catalog Verified', 'done'),
    ('booking_black_coffee_01', '09:23', 'Purchase Order #PO-8824 Created for Moët', 'done'),
    ('booking_black_coffee_01', '11:42', 'NamBev Beverage Delivery Received', 'done'),
    ('booking_black_coffee_01', '16:00', 'Green Room VIP 2 Setup Prepared', 'done'),
    ('booking_black_coffee_01', '17:00', 'Rider Inventory Lockup Reserved (32 Avail)', 'done'),
    ('booking_black_coffee_01', '18:00', 'Artist Escort Arrival & Sound Check', 'current'),
    ('booking_black_coffee_01', '22:30', 'Headline Set Performance Started', 'future'),
    ('booking_black_coffee_01', '01:00', 'Performance Finished & Venue Departure', 'future')
ON CONFLICT DO NOTHING;

COMMIT;
