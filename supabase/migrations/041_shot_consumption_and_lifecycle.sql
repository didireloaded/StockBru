-- 041_shot_consumption_and_lifecycle.sql

CREATE TABLE IF NOT EXISTS public.shot_sales_and_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  open_bottle_id UUID REFERENCES public.open_bottles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.catalog_products(id),
  event_type TEXT NOT NULL, -- 'shot_sold', 'complimentary', 'spillage', 'tasting', 'calibration_weight'
  volume_consumed_ml NUMERIC NOT NULL,
  volume_remaining_after_ml NUMERIC NOT NULL,
  selling_price_nad NUMERIC DEFAULT 0,
  pos_transaction_id UUID,
  bartender_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);
ALTER TABLE public.shot_sales_and_consumption ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read shot_sales_and_consumption" ON public.shot_sales_and_consumption FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.bottle_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  open_bottle_id UUID REFERENCES public.open_bottles(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- 'opened_fresh', 'halfway_mark', 'low_alert', 'bottle_killed', 'wasted'
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.bottle_lifecycle_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read bottle_lifecycle_events" ON public.bottle_lifecycle_events FOR ALL USING (true);
