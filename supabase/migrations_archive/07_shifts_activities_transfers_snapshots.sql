-- 07_shifts_activities_transfers_snapshots.sql

CREATE TABLE IF NOT EXISTS public.shifts (
  id BIGINT PRIMARY KEY,
  "user" TEXT NOT NULL,
  role TEXT NOT NULL,
  date TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT,
  status TEXT DEFAULT 'scheduled',
  sales NUMERIC DEFAULT 0,
  notes TEXT
);
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to shifts" ON public.shifts FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.activities (
  id BIGINT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  "user" TEXT,
  time TEXT NOT NULL,
  "isAlert" BOOLEAN DEFAULT false
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to activities" ON public.activities FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.transfers (
  id BIGINT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  "bottleId" BIGINT REFERENCES public.bottles(id) ON DELETE CASCADE,
  "bottleName" TEXT NOT NULL,
  qty INTEGER NOT NULL,
  "fromLocation" TEXT NOT NULL,
  "toLocation" TEXT NOT NULL,
  "user" TEXT NOT NULL,
  notes TEXT
);
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to transfers" ON public.transfers FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.snapshots (
  id BIGINT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  name TEXT NOT NULL,
  scope TEXT NOT NULL,
  location TEXT,
  category TEXT,
  counts JSONB NOT NULL DEFAULT '[]'::jsonb,
  "totalValue" NUMERIC DEFAULT 0,
  "totalItems" INTEGER DEFAULT 0,
  "user" TEXT NOT NULL,
  notes TEXT
);
ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to snapshots" ON public.snapshots FOR ALL USING (true);
