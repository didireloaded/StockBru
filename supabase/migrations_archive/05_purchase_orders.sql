-- 05_purchase_orders.sql
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id BIGINT PRIMARY KEY,
  "supplierId" BIGINT REFERENCES public.suppliers(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  total NUMERIC DEFAULT 0,
  notes TEXT
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to purchase_orders" ON public.purchase_orders FOR ALL USING (true);
