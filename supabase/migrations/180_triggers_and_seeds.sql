-- 180_triggers_and_seeds.sql

-- 1. Trigger Function: Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.fn_auto_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to core tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('tenants', 'branches', 'catalog_products', 'inventory_items', 'open_bottles')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_update_timestamp ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER trg_update_timestamp BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.fn_auto_update_timestamp();', t);
  END LOOP;
END $$;

-- 2. Seed Data: Default System Roles
INSERT INTO public.permissions (code, module, description) VALUES
('pos.login', 'POS', 'Can login to POS bartender screen'),
('inventory.count', 'Inventory', 'Can perform blind stock counts'),
('inventory.adjust', 'Inventory', 'Can approve variances and adjustments'),
('po.create', 'Purchasing', 'Can draft purchase orders'),
('po.approve', 'Purchasing', 'Can approve supplier purchase orders'),
('reports.export', 'Reporting', 'Can export financial and inventory reports')
ON CONFLICT (code) DO NOTHING;
