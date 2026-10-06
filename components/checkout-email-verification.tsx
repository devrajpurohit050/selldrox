"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export function CheckoutEmailVerification({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState('Verifying your checkout email…');

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!/^SDX-[A-F0-9]{16}$/.test(orderId)) {
        setMessage('This verification link is invalid. Return to checkout support for help.');
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        setMessage('Email verification is unavailable. Please contact support.');
        return;
      }

      const verificationClient = createClient(supabaseUrl, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: true,
          storageKey: `selldrox-checkout-verify-${orderId}`,
        },
      });
      const { data, error } = await verificationClient.auth.getSession();
      if (error || !data.session?.access_token || !data.session.user.email_confirmed_at) {
        setMessage('This email verification link is invalid or has expired. Request a new link from the purchase page.');
        return;
      }

      sessionStorage.setItem(`selldrox-checkout-verification:${orderId}`, data.session.access_token);
      if (active) {
        window.location.replace(`/success?orderId=${encodeURIComponent(orderId)}`);
      }
    };

    void verify();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-xl rounded-[32px] p-8 text-center md:p-12">
        <h1 className="text-3xl font-black text-white">Email verification</h1>
        <p role="status" className="mt-4 text-slate-300">{message}</p>
      </div>
    </main>
  );
}
