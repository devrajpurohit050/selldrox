"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getSupabaseClient } from '@/lib/supabase';

export default function AccountPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error }) => {
      setUserEmail(data.user?.email ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
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

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Purchased products</div>
            <div className="mt-3 text-3xl font-black text-white">1</div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Order history</div>
            <div className="mt-3 text-3xl font-black text-white">2</div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="text-sm text-slate-400">Payment status</div>
            <div className="mt-3 text-3xl font-black text-white">Paid</div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/download/demo" className="primary-btn">Download / access</Link>
          <Link href="/contact" className="secondary-btn">Support</Link>
        </div>
      </div>
    </main>
  );
}
