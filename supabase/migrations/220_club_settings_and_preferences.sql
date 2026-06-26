-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 220
-- Domain: Single Club Master Settings, Preferences & Operational Configuration
-- ============================================================================

BEGIN;

-- 1. Single Club System Preferences & Operational Parameters Table
CREATE TABLE IF NOT EXISTS public.club_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_name TEXT NOT NULL UNIQUE DEFAULT 'StockBru Nightclub Venue',
    country TEXT NOT NULL DEFAULT 'Namibia',
    currency_symbol TEXT NOT NULL DEFAULT 'N$',
    currency_code TEXT NOT NULL DEFAULT 'NAD',
    vat_tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    timezone TEXT NOT NULL DEFAULT 'Africa/Windhoek',
    default_opening_time TEXT NOT NULL DEFAULT '20:00',
    default_closing_time TEXT NOT NULL DEFAULT '04:00',
    
    -- Inventory Rules
    enable_tare_weight_calculation BOOLEAN NOT NULL DEFAULT true,
    reorder_buffer_days INTEGER NOT NULL DEFAULT 7,
    dead_stock_threshold_days INTEGER NOT NULL DEFAULT 42,
    variance_tolerance_ml NUMERIC(6, 2) NOT NULL DEFAULT 15.00,
    
    -- Shift & Roster Rules
    require_blind_count_reconciliation BOOLEAN NOT NULL DEFAULT true,
    auto_logout_pos_on_shift_close BOOLEAN NOT NULL DEFAULT true,
    max_active_bartender_pins INTEGER NOT NULL DEFAULT 20,
    
    -- Barcode Scanner Hardware Rules
    barcode_prefix TEXT NOT NULL DEFAULT 'SB',
    auto_submit_on_scan BOOLEAN NOT NULL DEFAULT true,
    enable_camera_scanner BOOLEAN NOT NULL DEFAULT true,
    
    -- Backup & Data Retention
    hourly_cloud_backups_enabled BOOLEAN NOT NULL DEFAULT true,
    storage_bucket_name TEXT NOT NULL DEFAULT 'sb_backups',
    activity_log_retention_days INTEGER NOT NULL DEFAULT 90,
    
    -- Support & Licensing
    support_tier TEXT NOT NULL DEFAULT 'VIP Single Club Enterprise',
    support_hotline_contact TEXT NOT NULL DEFAULT '+264 81 234 5678',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Staff Profile Preferences Table (Notification & UI appearance toggles)
CREATE TABLE IF NOT EXISTS public.user_settings_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL UNIQUE,
    pos_pin_hash TEXT,
    theme_appearance TEXT NOT NULL DEFAULT 'Dark Luxury' CHECK (theme_appearance IN ('Dark Luxury', 'Neon Club', 'High Contrast')),
    
    -- Dispatch Alerts
    notify_out_of_stock BOOLEAN NOT NULL DEFAULT true,
    notify_critical_risk BOOLEAN NOT NULL DEFAULT true,
    notify_shift_closing BOOLEAN NOT NULL DEFAULT true,
    notify_variance_loss BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seed Master Club Settings Row
INSERT INTO public.club_settings (
    id, club_name, country, currency_symbol, currency_code, vat_tax_rate, timezone,
    default_opening_time, default_closing_time, enable_tare_weight_calculation,
    reorder_buffer_days, dead_stock_threshold_days, variance_tolerance_ml,
    require_blind_count_reconciliation, auto_logout_pos_on_shift_close,
    barcode_prefix, auto_submit_on_scan, enable_camera_scanner, hourly_cloud_backups_enabled
)
VALUES (
    gen_random_uuid(), 'Skyline Rooftop Bar & Lounge (Main Venue)', 'Namibia', 'N$', 'NAD', 15.00, 'Africa/Windhoek',
    '20:00', '04:00', true,
    7, 42, 15.00,
    true, true,
    'SB', true, true, true
)
ON CONFLICT (club_name) DO UPDATE SET
    updated_at = NOW();

-- 4. Seed Default Admin User Preference Row
INSERT INTO public.user_settings_preferences (id, user_name, theme_appearance, notify_out_of_stock, notify_critical_risk, notify_shift_closing, notify_variance_loss)
VALUES (gen_random_uuid(), 'Pedro Manager', 'Dark Luxury', true, true, true, true)
ON CONFLICT (user_name) DO NOTHING;

-- 5. Enable RLS and Create Policies
ALTER TABLE public.club_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on club settings" ON public.club_settings FOR ALL USING (true);
CREATE POLICY "Allow authenticated read on user preferences" ON public.user_settings_preferences FOR ALL USING (true);

COMMIT;
