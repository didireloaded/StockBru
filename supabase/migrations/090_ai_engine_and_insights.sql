-- 090_ai_engine_and_insights.sql

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  context_branch_id UUID REFERENCES public.branches(id)
);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read ai_conversations" ON public.ai_conversations FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.ai_inventory_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'theft_risk', 'demand_spike', 'dead_stock_drain', 'supplier_delay_risk'
  severity TEXT DEFAULT 'warning', -- 'info', 'warning', 'critical'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommended_action TEXT,
  affected_product_id UUID REFERENCES public.catalog_products(id),
  confidence_score NUMERIC DEFAULT 0.95,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_inventory_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read ai_inventory_insights" ON public.ai_inventory_insights FOR ALL USING (true);
