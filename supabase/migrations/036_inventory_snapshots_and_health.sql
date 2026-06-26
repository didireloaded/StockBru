-- 036_inventory_snapshots_and_health.sql

CREATE TABLE IF NOT EXISTS public.inventory_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  snapshot_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_valuation_nad NUMERIC DEFAULT 0,
  total_items_count INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 100, -- 0 to 100
  snapshot_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.inventory_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_snapshots" ON public.inventory_snapshots FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.inventory_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_score INTEGER NOT NULL,
  out_of_stock_count INTEGER DEFAULT 0,
  critical_count INTEGER DEFAULT 0,
  dead_stock_value NUMERIC DEFAULT 0,
  expired_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(branch_id, log_date)
);
ALTER TABLE public.inventory_health_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_health_logs" ON public.inventory_health_logs FOR ALL USING (true);
