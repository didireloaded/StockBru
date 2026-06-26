-- 100_reporting_and_notifications.sql

CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id),
  title TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'valuation', 'sales_margin', 'stocktake_variance', 'po_history'
  filter_parameters JSONB DEFAULT '{}'::jsonb,
  is_scheduled BOOLEAN DEFAULT false,
  cron_schedule TEXT, -- e.g. '0 6 * * 1'
  export_format TEXT DEFAULT 'pdf', -- 'pdf', 'csv', 'xlsx'
  recipients TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read saved_reports" ON public.saved_reports FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.notification_dispatch_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  recipient_user_id UUID REFERENCES auth.users(id),
  recipient_phone TEXT,
  recipient_email TEXT,
  channel TEXT NOT NULL, -- 'in_app', 'email', 'whatsapp', 'sms', 'push'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);
ALTER TABLE public.notification_dispatch_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read notification_dispatch_queue" ON public.notification_dispatch_queue FOR ALL USING (true);
