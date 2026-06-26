-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 200
-- Domain: Proactive Operations Intelligence Engine (OIE) & Briefing Storage
-- ============================================================================

BEGIN;

-- 1. Operational Recommendations (Prioritized Decision Engine with Explainability)
CREATE TABLE IF NOT EXISTS public.operational_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    action_type TEXT NOT NULL, -- e.g. 'reorder', 'delay_purchase', 'transfer', 'audit_loss'
    action_title TEXT NOT NULL,
    target_sku TEXT,
    suggested_quantity INTEGER DEFAULT 0,
    explainability_reason TEXT NOT NULL, -- Mandatory plain-English rationale
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_op_rec_branch_priority ON public.operational_recommendations(branch_id, priority, status);

-- 2. Daily Briefings (Automated Morning Operational Summaries)
CREATE TABLE IF NOT EXISTS public.daily_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    briefing_date DATE DEFAULT CURRENT_DATE,
    yesterday_revenue NUMERIC(12, 2) DEFAULT 0,
    yesterday_transactions INTEGER DEFAULT 0,
    inventory_loss_value NUMERIC(12, 2) DEFAULT 0,
    top_selling_skus JSONB DEFAULT '[]'::jsonb,
    outstanding_tasks JSONB DEFAULT '[]'::jsonb,
    purchase_recommendations JSONB DEFAULT '[]'::jsonb,
    critical_alerts JSONB DEFAULT '[]'::jsonb,
    today_priorities JSONB DEFAULT '[]'::jsonb,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, briefing_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_briefing_date ON public.daily_briefings(branch_id, briefing_date DESC);

-- 3. Shift Intelligence Summaries (Automated Shift Closing Reconciliation)
CREATE TABLE IF NOT EXISTS public.shift_intelligence_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id BIGINT REFERENCES public.shifts(id) ON DELETE CASCADE,
    bartender_name TEXT NOT NULL,
    gross_sales NUMERIC(12, 2) DEFAULT 0,
    bottle_sales_count INTEGER DEFAULT 0,
    shot_sales_count INTEGER DEFAULT 0,
    complimentary_drinks_count INTEGER DEFAULT 0,
    refunds_voids_amount NUMERIC(12, 2) DEFAULT 0,
    variance_ml NUMERIC(10, 2) DEFAULT 0,
    performance_score INTEGER DEFAULT 100,
    automated_notes TEXT,
    closed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Seed Initial Explainable Recommendations
INSERT INTO public.operational_recommendations (id, priority, action_type, action_title, target_sku, suggested_quantity, explainability_reason)
VALUES 
    (gen_random_uuid(), 'Critical', 'reorder', 'Reorder 48 Hunters Gold Dry Cider', 'Hunters Gold', 48, 'Average weekend consumption increased 32% over the past three weeks. Current stock (12 units) will run out before next scheduled Friday delivery.'),
    (gen_random_uuid(), 'High', 'transfer', 'Transfer 18 units Ciroc Red Berry to VIP Bar', 'Ciroc Red Berry', 18, 'VIP Bar inventory is down to 2 sealed bottles. Main Warehouse currently holds 45 units with zero immediate storeroom demand.'),
    (gen_random_uuid(), 'Medium', 'delay_purchase', 'Delay purchasing Jameson Irish Whiskey', 'Jameson', 0, 'Current inventory velocity indicates 28 days of buffer stock remaining. Purchasing now would tie up N$ 14,500 in working capital prematurely.'),
    (gen_random_uuid(), 'Low', 'audit_loss', 'Investigate dead stock SKU: Campari Bitter', 'Campari', 0, 'Zero units recorded sold across POS registers over the last 42 days while occupying shelf space in primary bar display.')
ON CONFLICT DO NOTHING;

COMMIT;
