CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  product_id uuid REFERENCES public.products(id) NOT NULL,
  currency text CHECK (currency IN ('INR', 'USD')) NOT NULL,
  amount numeric(10,2) NOT NULL,
  payment_provider text CHECK (payment_provider IN ('cashfree', 'paypal')) NOT NULL,
  provider_order_id text,
  provider_payment_id text,
  status text CHECK (status IN ('pending','processing','paid','failed','cancelled','refunded')) NOT NULL DEFAULT 'pending',
  country text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

CREATE TABLE public.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  order_id uuid REFERENCES public.orders(id) NOT NULL,
  product_id uuid REFERENCES public.products(id) NOT NULL,
  access_type text DEFAULT 'digital-vault',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  status text DEFAULT 'active'
);

CREATE TABLE public.download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  order_id uuid REFERENCES public.orders(id),
  ip_hash text,
  user_agent text,
  downloaded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_entitlements_user_id ON public.entitlements(user_id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Products are readable to everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can read own entitlements" ON public.entitlements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own download logs" ON public.download_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own download logs" ON public.download_logs FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
