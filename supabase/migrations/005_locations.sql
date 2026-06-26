-- 005_locations.sql
CREATE TABLE IF NOT EXISTS public.storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.storage_locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g. 'room', 'fridge', 'shelf', 'bin'
  barcode TEXT,
  temperature_zone TEXT, -- 'ambient', 'chilled', 'frozen'
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

ALTER TABLE public.storage_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to storage_locations" ON public.storage_locations FOR ALL USING (true);
