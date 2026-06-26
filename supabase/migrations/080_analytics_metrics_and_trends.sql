-- 080_analytics_metrics_and_trends.sql

CREATE TABLE IF NOT EXISTS public.daily_inventory_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_inventory_value_nad NUMERIC DEFAULT 0,
  total_sales_revenue_nad NUMERIC DEFAULT 0,
  total_cost_of_goods_sold_nad NUMERIC DEFAULT 0,
  gross_margin_percentage NUMERIC DEFAULT 0,
  fast_moving_sku_count INTEGER DEFAULT 0,
  dead_stock_sku_count INTEGER DEFAULT 0,
  low_stock_alerts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(branch_id, summary_date)
);
ALTER TABLE public.daily_inventory_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read daily_inventory_summaries" ON public.daily_inventory_summaries FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.reorder_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  supplier_id BIGINT REFERENCES public.suppliers(id),
  current_stock INTEGER NOT NULL,
  suggested_reorder_qty INTEGER NOT NULL,
  estimated_cost_nad NUMERIC NOT NULL,
  velocity_daily_avg NUMERIC DEFAULT 0,
  days_until_stockout NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'converted_to_po', 'dismissed'
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reorder_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read reorder_recommendations" ON public.reorder_recommendations FOR ALL USING (true);
