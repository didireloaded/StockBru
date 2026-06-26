-- 06_stocktakes.sql
CREATE TABLE IF NOT EXISTS public.stocktakes (
  id BIGINT PRIMARY KEY,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  "user" TEXT NOT NULL,
  notes TEXT
);

ALTER TABLE public.stocktakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to stocktakes" ON public.stocktakes FOR ALL USING (true);
