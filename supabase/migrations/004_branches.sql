-- 004_branches.sql
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type branch_type DEFAULT 'nightclub',
  timezone TEXT DEFAULT 'Africa/Windhoek',
  currency TEXT DEFAULT 'NAD',
  tax_rate NUMERIC DEFAULT 0.15,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1,
  UNIQUE(tenant_id, code)
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to branches" ON public.branches FOR ALL USING (true);
