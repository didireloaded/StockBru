-- ============================================================================
-- StockBru Enterprise Inventory Operating System — Migration 240
-- Domain: Database Performance Query Optimizations, Indexes & Vacuum Targets
-- ============================================================================

BEGIN;

-- 1. High-Performance B-Tree Composite Indexes for POS Ledger & Dashboards
CREATE INDEX IF NOT EXISTS idx_movements_perf_composite ON public.inventory_movements (created_at DESC, event_name, work_area);
CREATE INDEX IF NOT EXISTS idx_bottles_perf_lookup ON public.inventory_items (status, location_id);
CREATE INDEX IF NOT EXISTS idx_sales_perf_date ON public.sales (created_at DESC, cashier_name);
CREATE INDEX IF NOT EXISTS idx_open_bottles_perf_status ON public.open_bottles (is_empty, opened_at DESC);

-- 2. Optimize Postgres Query Planner Statistics Target
ALTER TABLE IF EXISTS public.inventory_items ALTER COLUMN quantity SET STATISTICS 500;
ALTER TABLE IF EXISTS public.inventory_movements ALTER COLUMN created_at SET STATISTICS 500;

-- 3. Create Fast Materialized View Refresh Helper Function
CREATE OR REPLACE FUNCTION public.refresh_dashboard_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Refresh aggregated views without locking read tables
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_daily_inventory_health') THEN
        REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_daily_inventory_health;
    END IF;
END;
$$;

COMMIT;
