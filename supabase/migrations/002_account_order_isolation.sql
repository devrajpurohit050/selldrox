DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own download logs" ON public.download_logs;
CREATE POLICY "Users can insert own download logs"
  ON public.download_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.store_orders (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  currency text NOT NULL CHECK (currency IN ('INR', 'USD')),
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  payment_provider text NOT NULL CHECK (payment_provider IN ('cashfree', 'paypal')),
  provider_order_id text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_store_orders_user_created
  ON public.store_orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_provider_order
  ON public.store_orders (payment_provider, provider_order_id);

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own store orders" ON public.store_orders;
CREATE POLICY "Users can read own store orders"
  ON public.store_orders FOR SELECT
  USING (auth.uid() = user_id);

REVOKE ALL ON public.store_orders FROM anon;
GRANT SELECT ON public.store_orders TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.store_orders FROM authenticated;
