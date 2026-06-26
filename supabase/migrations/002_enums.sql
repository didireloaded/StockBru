-- 002_enums.sql

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
    CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'branch_type') THEN
    CREATE TYPE branch_type AS ENUM ('nightclub', 'bar', 'restaurant', 'warehouse', 'vip_lounge');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_movement_type') THEN
    CREATE TYPE inventory_movement_type AS ENUM ('received', 'sold', 'opened', 'shot_poured', 'adjusted', 'variance', 'damaged', 'transferred', 'returned');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'po_status') THEN
    CREATE TYPE po_status AS ENUM ('draft', 'pending', 'approved', 'received', 'partial', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stocktake_status') THEN
    CREATE TYPE stocktake_status AS ENUM ('draft', 'in_progress', 'under_review', 'completed', 'cancelled');
  END IF;
END $$;
