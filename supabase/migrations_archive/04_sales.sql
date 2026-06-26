-- 04_sales.sql
CREATE TABLE IF NOT EXISTS public.sales (
  id BIGINT PRIMARY KEY,
  date TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  customer TEXT,
  "tableNumber" TEXT,
  "user" TEXT NOT NULL
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sales" ON public.sales FOR ALL USING (true);
