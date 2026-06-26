-- 030_inventory_items_and_batches.sql

CREATE TABLE IF NOT EXISTS public.inventory_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  received_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  initial_quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  unit_cost_nad NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_batches" ON public.inventory_batches FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.storage_locations(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.inventory_batches(id) ON DELETE SET NULL,
  quantity_on_hand INTEGER DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 6,
  max_stock_level INTEGER DEFAULT 48,
  status TEXT DEFAULT 'normal', -- 'normal', 'low', 'critical', 'overstocked'
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1,
  UNIQUE(branch_id, location_id, product_id, batch_id)
);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_items" ON public.inventory_items FOR ALL USING (true);
