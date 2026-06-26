-- 150_enterprise_views_and_functions.sql

-- 1. Database View: Live Inventory Valuation View
CREATE OR REPLACE VIEW public.vw_branch_inventory_summary AS
SELECT 
  i.branch_id,
  b.name AS branch_name,
  COUNT(i.id) AS total_sku_tracked,
  SUM(i.quantity_on_hand) AS total_units_on_hand,
  SUM(i.quantity_on_hand * COALESCE(p.cost_price, 0)) AS total_inventory_value_nad
FROM public.inventory_items i
JOIN public.branches b ON b.id = i.branch_id
JOIN public.catalog_products p ON p.id = i.product_id
WHERE i.is_deleted = false
GROUP BY i.branch_id, b.name;

-- 2. Stored Function: open_bottle (Transforms full bottle item into open partial bottle)
CREATE OR REPLACE FUNCTION public.fn_open_bottle(
  p_tenant_id UUID,
  p_branch_id UUID,
  p_inventory_item_id UUID,
  p_opened_by UUID
) RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_volume INTEGER;
  v_new_open_id UUID;
BEGIN
  SELECT product_id INTO v_product_id FROM public.inventory_items WHERE id = p_inventory_item_id;
  SELECT bottle_size_ml INTO v_volume FROM public.catalog_products WHERE id = v_product_id;

  -- Decrement full bottle quantity
  UPDATE public.inventory_items 
  SET quantity_on_hand = GREATEST(0, quantity_on_hand - 1), updated_at = now()
  WHERE id = p_inventory_item_id;

  -- Create Open Bottle entry
  INSERT INTO public.open_bottles (
    tenant_id, branch_id, inventory_item_id, product_id, opened_by, initial_volume_ml, remaining_volume_ml
  ) VALUES (
    p_tenant_id, p_branch_id, p_inventory_item_id, v_product_id, p_opened_by, COALESCE(v_volume, 750), COALESCE(v_volume, 750)
  ) RETURNING id INTO v_new_open_id;

  -- Record audit movement
  INSERT INTO public.inventory_movements (
    tenant_id, branch_id, inventory_item_id, product_id, movement_type, quantity_change, quantity_after, performed_by, notes
  ) VALUES (
    p_tenant_id, p_branch_id, p_inventory_item_id, v_product_id, 'opened', -1, 0, p_opened_by, 'Bottle opened for bar service'
  );

  RETURN v_new_open_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Stored Function: record_shot (Decays remaining volume of an open bottle)
CREATE OR REPLACE FUNCTION public.fn_record_shot(
  p_open_bottle_id UUID,
  p_volume_ml NUMERIC,
  p_bartender_id UUID,
  p_pos_transaction_id UUID
) RETURNS NUMERIC AS $$
DECLARE
  v_remaining NUMERIC;
  v_tenant UUID;
  v_branch UUID;
  v_product UUID;
BEGIN
  SELECT remaining_volume_ml, tenant_id, branch_id, product_id 
  INTO v_remaining, v_tenant, v_branch, v_product
  FROM public.open_bottles WHERE id = p_open_bottle_id;

  v_remaining := GREATEST(0, v_remaining - p_volume_ml);

  UPDATE public.open_bottles 
  SET remaining_volume_ml = v_remaining, 
      status = CASE WHEN v_remaining <= 0 THEN 'empty_normal' ELSE status END,
      closed_at = CASE WHEN v_remaining <= 0 THEN now() ELSE closed_at END
  WHERE id = p_open_bottle_id;

  INSERT INTO public.shot_sales_and_consumption (
    tenant_id, branch_id, open_bottle_id, product_id, event_type, volume_consumed_ml, volume_remaining_after_ml, pos_transaction_id, bartender_id
  ) VALUES (
    v_tenant, v_branch, p_open_bottle_id, v_product, 'shot_sold', p_volume_ml, v_remaining, p_pos_transaction_id, p_bartender_id
  );

  RETURN v_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
