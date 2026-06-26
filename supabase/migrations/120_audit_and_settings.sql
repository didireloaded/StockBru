-- 120_audit_and_settings.sql

CREATE TABLE IF NOT EXISTS public.enterprise_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- e.g. 'inventory.adjusted', 'bottle.opened', 'pos.voided', 'settings.updated'
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.enterprise_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read enterprise_audit_logs" ON public.enterprise_audit_logs FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.company_and_branch_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id), -- Null if company-wide default
  settings_group TEXT NOT NULL, -- 'pos', 'inventory', 'hardware_scanner', 'ai_assistant', 'notifications'
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, branch_id, settings_group, key)
);
ALTER TABLE public.company_and_branch_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read company_and_branch_settings" ON public.company_and_branch_settings FOR ALL USING (true);
