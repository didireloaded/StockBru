-- 03_movements.sql
CREATE TABLE IF NOT EXISTS public.movements (
  id BIGINT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  "bottleId" BIGINT REFERENCES public.bottles(id) ON DELETE CASCADE,
  "bottleName" TEXT NOT NULL,
  sku TEXT NOT NULL,
  qty INTEGER NOT NULL,
  "fromLocation" TEXT,
  "toLocation" TEXT,
  "user" TEXT NOT NULL,
  notes TEXT
);

ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to movements" ON public.movements FOR ALL USING (true);
