-- 040_open_bottles.sql

CREATE TABLE IF NOT EXISTS public.open_bottles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_by UUID REFERENCES auth.users(id),
  initial_volume_ml NUMERIC NOT NULL DEFAULT 750,
  remaining_volume_ml NUMERIC NOT NULL DEFAULT 750,
  standard_shot_size_ml NUMERIC DEFAULT 25,
  tare_weight_g NUMERIC,
  last_gross_weight_g NUMERIC,
  status TEXT DEFAULT 'active', -- 'active', 'empty_normal', 'wasted', 'spilled'
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);
ALTER TABLE public.open_bottles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read open_bottles" ON public.open_bottles FOR ALL USING (true);
