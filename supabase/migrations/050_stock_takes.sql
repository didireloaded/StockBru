-- 050_stock_takes.sql

CREATE TABLE IF NOT EXISTS public.stocktake_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  type TEXT DEFAULT 'full_blind', -- 'full_blind', 'cycle_count', 'spot_check', 'handover'
  status stocktake_status DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  lead_counter_id UUID REFERENCES auth.users(id),
  notes TEXT
);
ALTER TABLE public.stocktake_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read stocktake_sessions" ON public.stocktake_sessions FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.stocktake_counts_and_variances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.stocktake_sessions(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.storage_locations(id),
  product_id UUID REFERENCES public.catalog_products(id),
  expected_full_bottles INTEGER DEFAULT 0,
  expected_open_volume_ml NUMERIC DEFAULT 0,
  actual_full_bottles INTEGER DEFAULT 0,
  actual_open_volume_ml NUMERIC DEFAULT 0,
  variance_full_bottles INTEGER DEFAULT 0,
  variance_open_volume_ml NUMERIC DEFAULT 0,
  variance_cost_nad NUMERIC DEFAULT 0,
  cause_investigation TEXT, -- 'theft', 'unrecorded_spillage', 'overpour', 'miscount', 'pending'
  counted_by UUID REFERENCES auth.users(id),
  counted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stocktake_counts_and_variances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read stocktake_counts_and_variances" ON public.stocktake_counts_and_variances FOR ALL USING (true);
