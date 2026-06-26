-- 022_catalog_products.sql

CREATE TABLE IF NOT EXISTS public.catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  legacy_id BIGINT, -- Mirror V1 integer IDs for backward compatibility
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  qr_code TEXT,
  bottle_size_ml INTEGER DEFAULT 750,
  shot_size_ml INTEGER DEFAULT 25,
  default_tare_weight_g NUMERIC DEFAULT 450,
  cost_price NUMERIC DEFAULT 0,
  selling_price NUMERIC DEFAULT 0,
  reorder_level INTEGER DEFAULT 12,
  tags TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read catalog_products" ON public.catalog_products FOR ALL USING (true);
