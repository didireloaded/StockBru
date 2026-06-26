-- 070_sales_and_payments.sql

CREATE TABLE IF NOT EXISTS public.pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id),
  receipt_number TEXT UNIQUE NOT NULL,
  sale_type TEXT DEFAULT 'normal', -- 'normal', 'complimentary_promotional', 'staff_discount', 'voided'
  subtotal_nad NUMERIC DEFAULT 0,
  tax_nad NUMERIC DEFAULT 0,
  discount_nad NUMERIC DEFAULT 0,
  tip_nad NUMERIC DEFAULT 0,
  total_nad NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'card', -- 'cash', 'card', 'room_charge', 'tab', 'split'
  bartender_id UUID REFERENCES auth.users(id),
  customer_name TEXT,
  table_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_voided BOOLEAN DEFAULT false,
  void_reason TEXT,
  voided_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.pos_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read pos_transactions" ON public.pos_transactions FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.pos_transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.pos_transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.catalog_products(id),
  item_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit_price_nad NUMERIC NOT NULL,
  total_price_nad NUMERIC NOT NULL,
  is_open_shot BOOLEAN DEFAULT false,
  open_bottle_id UUID REFERENCES public.open_bottles(id)
);
ALTER TABLE public.pos_transaction_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read pos_transaction_items" ON public.pos_transaction_items FOR ALL USING (true);
