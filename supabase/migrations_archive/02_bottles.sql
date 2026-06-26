-- 02_bottles.sql
CREATE TABLE IF NOT EXISTS public.bottles (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  barcode TEXT,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  "openBottles" INTEGER DEFAULT 0,
  "remainingVolume" NUMERIC,
  price NUMERIC DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  "reorderLevel" INTEGER DEFAULT 10,
  "maxStock" INTEGER,
  status TEXT DEFAULT 'Normal',
  "supplierId" BIGINT REFERENCES public.suppliers(id) ON DELETE SET NULL,
  location TEXT,
  notes TEXT,
  tags TEXT[],
  "expiryDate" TEXT,
  "batchNumber" TEXT,
  favorite BOOLEAN DEFAULT false,
  "createdAt" TEXT,
  "lastMovementAt" TEXT
);

ALTER TABLE public.bottles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to bottles" ON public.bottles FOR ALL USING (true);
