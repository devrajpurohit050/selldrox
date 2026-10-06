"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getSupabaseClient } from '@/lib/supabase';

type AccountOrder = {
  id: string;
  product_id: string;
  currency: 'INR' | 'USD';
  amount: number;
  payment_provider: 'cashfree' | 'paypal';
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  created_at: string;
};

export default function AccountPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    let requestVersion = 0;
    const loadUserOrders = async (userId: string | null, email: string | null) => {
      const currentVersion = ++requestVersion;
      setUserEmail(email);
      setLoading(false);
      setOrdersError('');
      setOrders([]);

      if (!userId) {
        setOrdersLoading(false);
        return;
      }

      setOrdersLoading(true);
      const { data, error } = await supabase
        .from('store_orders')
        .select('id, product_id, currency, amount, payment_provider, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!active || currentVersion !== requestVersion) return;
      if (error) {
        setOrdersError('Unable to load your orders. Please refresh or contact support.');
      } else {
        setOrders((data ?? []) as AccountOrder[]);
      }
      setOrdersLoading(false);
    };

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setOrdersError('Unable to verify your session. Please sign in again.');
        setUserEmail(null);
        setLoading(false);
        return;
      }
      void loadUserOrders(data.user?.id ?? null, data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadUserOrders(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <main className="container-shell py-20">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 text-slate-300 md:p-10">
          Loading account…
        </div>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="container-shell py-20">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 text-center md:p-10">
          <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Account</div>
          <h1 className="mt-4 text-3xl font-black text-white">Please sign in</h1>
          <p className="mt-4 text-slate-300">Login with Google, Apple or your email to access the SELLDROX dashboard.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="primary-btn">Go to login</Link>
            <Link href="/signup" className="secondary-btn">Create account</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell py-20">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Account</div>
            <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Your SELLDROX dashboard</h1>
          </div>
          <button type="button" onClick={handleLogout} className="secondary-btn">Log out</button>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-4 text-slate-200">
          Signed in as <span className="font-semibold text-white">{userEmail}</span>
        </div>

        {ordersError ? (
          <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {ordersError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Purchased products</div>
            <div className="mt-3 text-3xl font-black text-white">
              {ordersLoading ? '…' : ordersError ? '—' : new Set(orders.filter((order) => order.status === 'paid').map((order) => order.product_id)).size}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Order history</div>
            <div className="mt-3 text-3xl font-black text-white">{ordersLoading ? '…' : ordersError ? '—' : orders.length}</div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Payment status</div>
            <div className="mt-3 text-3xl font-black capitalize text-white">
              {ordersLoading ? '…' : ordersError ? 'Unavailable' : orders[0]?.status ?? 'No orders'}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-lg font-bold text-white">Your orders</h2>
          {ordersLoading ? <p className="mt-3 text-sm text-slate-400">Loading your orders…</p> : null}
          {!ordersLoading && orders.length === 0 && !ordersError ? (
            <p className="mt-3 text-sm text-slate-400">No orders are linked to this account yet.</p>
          ) : null}
          {orders.length > 0 ? (
            <ul className="mt-4 divide-y divide-white/10">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <div className="font-medium text-white">{order.product_id}</div>
                    <div className="mt-1 text-slate-400">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {new Intl.NumberFormat(undefined, { style: 'currency', currency: order.currency }).format(order.amount)}
                    </div>
                    <div className="mt-1 capitalize text-slate-400">{order.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/checkout" className="primary-btn">Buy SELLDROX</Link>
          <Link href="/contact" className="secondary-btn">Support</Link>
        </div>
      </div>
    </main>
  );
}
