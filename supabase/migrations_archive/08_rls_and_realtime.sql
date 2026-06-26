-- 08_rls_and_realtime.sql

-- Enable Supabase Realtime for inventory tables
alter publication supabase_realtime add table public.bottles;
alter publication supabase_realtime add table public.movements;
alter publication supabase_realtime add table public.sales;
alter publication supabase_realtime add table public.activities;
