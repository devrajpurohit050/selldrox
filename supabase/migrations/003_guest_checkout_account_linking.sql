ALTER TABLE public.store_orders
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.store_orders
  ADD COLUMN IF NOT EXISTS buyer_email text;

CREATE INDEX IF NOT EXISTS idx_store_orders_guest_email
  ON public.store_orders (lower(buyer_email))
  WHERE user_id IS NULL;
