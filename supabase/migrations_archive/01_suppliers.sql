-- 01_suppliers.sql
CREATE TABLE IF NOT EXISTS public.suppliers (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  "bottlesSupplied" INTEGER DEFAULT 0,
  "logoColor" TEXT
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to suppliers" ON public.suppliers FOR ALL USING (true);
