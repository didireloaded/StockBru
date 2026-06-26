-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 190
-- Domain: Authentication, Onboarding & Global Search Analytics
-- ============================================================================

BEGIN;

-- 1. Login Activity Logs (Security & Auditing)
CREATE TABLE IF NOT EXISTS public.login_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    username TEXT NOT NULL,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    device_type TEXT DEFAULT 'Desktop',
    operating_system TEXT DEFAULT 'Windows',
    browser TEXT DEFAULT 'Chrome',
    status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'lockout'))
);

CREATE INDEX IF NOT EXISTS idx_login_activity_user ON public.login_activity_logs(user_id, login_at DESC);

-- 2. User Onboarding Preferences & State
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS walkthrough_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS ui_preferences JSONB DEFAULT '{"theme": "dark", "ctrl_k_enabled": true, "default_branch": null}'::jsonb;

-- 3. Global Search Analytics (Tracking Spotlight Search Navigation)
CREATE TABLE IF NOT EXISTS public.search_analytics (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    searched_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    matched_results_count INTEGER DEFAULT 0,
    clicked_entity_type TEXT, -- e.g. 'product', 'staff', 'po', 'action'
    clicked_entity_id TEXT,
    execution_time_ms INTEGER DEFAULT 0,
    searched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_analytics_tenant ON public.search_analytics(tenant_id, searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics(query);

-- 4. Seeded Global Command Actions (Spotlight Executable Actions)
CREATE TABLE IF NOT EXISTS public.global_search_commands (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    action_type TEXT NOT NULL, -- e.g. 'navigation', 'workflow', 'modal'
    target_path TEXT NOT NULL,
    required_role TEXT DEFAULT 'Viewer',
    icon_name TEXT DEFAULT 'Activity'
);

INSERT INTO public.global_search_commands (id, title, subtitle, action_type, target_path, required_role, icon_name)
VALUES 
    ('cmd_po', 'Create Purchase Order', 'Start a new supplier order workflow', 'workflow', 'pos', 'Stock Controller', 'ShoppingCart'),
    ('cmd_stocktake', 'Start Stock Take', 'Launch blind audit count session', 'workflow', 'stocktakes', 'Bartender', 'ClipboardCheck'),
    ('cmd_shift', 'Clock In / Start Shift', 'Open bartender POS cash drawer', 'modal', 'shifts', 'Bartender', 'Play'),
    ('cmd_product', 'Add New Catalog Product', 'Register new master SKU', 'workflow', 'inventory', 'Manager', 'Plus'),
    ('cmd_report', 'Export Master Valuation', 'Download CSV inventory audit', 'action', 'reports', 'Manager', 'Download')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle;

COMMIT;
