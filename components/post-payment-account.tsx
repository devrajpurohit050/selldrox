"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { getSupabaseClient } from '@/lib/supabase';

type ClaimState = 'checking' | 'sign-in' | 'claiming' | 'pending' | 'claimed' | 'error';

export function PostPaymentAccount({ orderId }: { orderId: string }) {
  const [state, setState] = useState<ClaimState>('checking');
  const [message, setMessage] = useState('');
  const returnPath = `/success?orderId=${encodeURIComponent(orderId)}`;
  const authQuery = `?next=${encodeURIComponent(returnPath)}`;

  const claimOrder = useCallback(async () => {
    if (!orderId) {
      setMessage('The order ID is missing. Please contact support for help.');
      setState('error');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage('Account sign-in is currently unavailable. Please contact support.');
      setState('error');
      return;
    }

    setState('checking');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setMessage('Unable to check your account session. Please try again.');
      setState('error');
      return;
    }
    if (!session?.access_token) {
      setState('sign-in');
      return;
    }

    setState('claiming');
    try {
      const response = await fetch('/api/orders/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const result: { ok?: boolean; error?: string; pending?: boolean } = await response.json();

      if (response.ok && result.ok) {
        setState('claimed');
      } else if (response.status === 202 && result.pending) {
        setMessage(result.error || 'Payment confirmation is still pending.');
        setState('pending');
      } else {
        setMessage(result.error || 'Unable to link this purchase to your account.');
        setState('error');
      }
    } catch {
      setMessage('Unable to verify this purchase right now. Please try again.');
      setState('error');
    }
  }, [orderId]);

  const switchAccount = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage('Account sign-in is unavailable. Please contact support.');
      return;
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setMessage('Unable to switch accounts. Please try again.');
      return;
    }
    setState('sign-in');
  };

  useEffect(() => {
    void claimOrder();
  }, [claimOrder]);

  return (
    <div className="mt-8">
      {state === 'claimed' ? (
        <>
          <div className="success-tick-pop mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_34px_rgba(16,185,129,0.34)]">
            <Check className="success-tick-draw h-7 w-7" strokeWidth={3.5} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black text-white">Your verified purchase is linked.</h1>
          <p className="mt-4 text-slate-300">Your SELLDROX purchase is now available in your account.</p>
          <Link href="/account" className="primary-btn mt-7">Go to your account</Link>
        </>
      ) : null}

      {state === 'checking' || state === 'claiming' ? (
        <>
          <h1 className="text-3xl font-black text-white">
            {state === 'checking' ? 'Checking your account…' : 'Verifying payment and linking your purchase…'}
          </h1>
          <p className="mt-4 text-slate-300">Order ID: {orderId || 'Unavailable'}</p>
        </>
      ) : null}

      {state === 'sign-in' ? (
        <>
          <h1 className="text-3xl font-black text-white">Payment received? Sign in to get your purchase.</h1>
          <p className="mt-4 text-slate-300">
            Use the same email address you entered at checkout. We will verify the payment and add the order to your account.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href={`/login${authQuery}`} className="primary-btn">Sign in</Link>
            <Link href={`/signup${authQuery}`} className="secondary-btn">Create account</Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">Order ID: {orderId || 'Unavailable'}</p>
        </>
      ) : null}

      {state === 'pending' || state === 'error' ? (
        <>
          <h1 className="text-3xl font-black text-white">
            {state === 'pending' ? 'Payment verification is still in progress.' : 'We could not link this purchase yet.'}
          </h1>
          <p role="status" className="mt-4 text-slate-300">{message}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => void claimOrder()} className="primary-btn">Try again</button>
            <button type="button" onClick={() => void switchAccount()} className="secondary-btn">
              Use another account
            </button>
            <Link href="/contact" className="secondary-btn">Contact support</Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">Order ID: {orderId || 'Unavailable'}</p>
        </>
      ) : null}
    </div>
  );
}
