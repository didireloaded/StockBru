-- 033_inventory_movements_and_transfers.sql

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.catalog_products(id),
  movement_type inventory_movement_type NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  unit_cost NUMERIC DEFAULT 0,
  reference_id UUID, -- Sale ID, PO ID, or Stocktake ID
  performed_by UUID REFERENCES auth.users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_movements" ON public.inventory_movements FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.inventory_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  from_branch_id UUID REFERENCES public.branches(id),
  to_branch_id UUID REFERENCES public.branches(id),
  from_location_id UUID REFERENCES public.storage_locations(id),
  to_location_id UUID REFERENCES public.storage_locations(id),
  product_id UUID REFERENCES public.catalog_products(id),
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_transit', 'completed', 'rejected'
  initiated_by UUID REFERENCES auth.users(id),
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read inventory_transfers" ON public.inventory_transfers FOR ALL USING (true);
