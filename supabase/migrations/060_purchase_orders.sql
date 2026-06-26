-- 060_purchase_orders.sql

CREATE TABLE IF NOT EXISTS public.enterprise_purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id),
  supplier_id BIGINT REFERENCES public.suppliers(id),
  po_number TEXT UNIQUE NOT NULL,
  status po_status DEFAULT 'pending',
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  subtotal_nad NUMERIC DEFAULT 0,
  tax_nad NUMERIC DEFAULT 0,
  total_nad NUMERIC DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT
);
ALTER TABLE public.enterprise_purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read enterprise_purchase_orders" ON public.enterprise_purchase_orders FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.goods_receipt_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  po_id UUID REFERENCES public.enterprise_purchase_orders(id) ON DELETE CASCADE,
  delivery_note_number TEXT,
  supplier_invoice_number TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  received_by UUID REFERENCES auth.users(id),
  items_received JSONB NOT NULL DEFAULT '[]'::jsonb
);
ALTER TABLE public.goods_receipt_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read goods_receipt_deliveries" ON public.goods_receipt_deliveries FOR ALL USING (true);
