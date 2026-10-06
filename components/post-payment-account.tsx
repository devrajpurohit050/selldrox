"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/lib/supabase';

type ClaimState = 'checking' | 'sign-in' | 'claiming' | 'email' | 'email-sent' | 'pending' | 'claimed' | 'error';

export function PostPaymentAccount({ orderId }: { orderId: string }) {
  const [state, setState] = useState<ClaimState>('checking');
  const [message, setMessage] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
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

    const checkoutVerification = sessionStorage.getItem(`selldrox-checkout-verification:${orderId}`);
    setState('claiming');
    try {
      const response = await fetch('/api/orders/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          ...(checkoutVerification ? { 'X-Checkout-Verification': checkoutVerification } : {}),
        },
        body: JSON.stringify({ orderId }),
      });
      const result: { ok?: boolean; error?: string; pending?: boolean; needsEmailVerification?: boolean } = await response.json();

      if (response.ok && result.ok) {
        sessionStorage.removeItem(`selldrox-checkout-verification:${orderId}`);
        setState('claimed');
      } else if (response.status === 403 && result.needsEmailVerification) {
        setMessage('');
        setState('email');
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

  const sendCheckoutCode = async () => {
    const normalizedEmail = checkoutEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMessage('Enter the email address you used during checkout.');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage('Account sign-in is currently unavailable. Please contact support.');
      return;
    }

    setState('claiming');
    setMessage('');
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        setMessage('Your account session expired. Please sign in again.');
        setState('error');
        return;
      }

      const orderResponse = await fetch('/api/orders/claim/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ orderId, checkoutEmail: normalizedEmail }),
      });
      const orderResult: { ok?: boolean; error?: string } = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.ok) {
        setMessage(orderResult.error || 'Unable to verify this checkout email.');
        setState('email');
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
        throw new Error('Email verification is not configured.');
      }
      const verificationClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const emailRedirectTo = new URL('/auth/checkout-email-verified', window.location.origin);
      emailRedirectTo.searchParams.set('orderId', orderId);
      const { error: otpError } = await verificationClient.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: emailRedirectTo.toString(),
        },
      });
      if (otpError) {
        throw otpError;
      }

      setCheckoutEmail(normalizedEmail);
      setState('email-sent');
      setMessage('Check your checkout email and open the one-time verification link.');
    } catch (verificationError: unknown) {
      setMessage(verificationError instanceof Error ? verificationError.message : 'Unable to send the verification code.');
      setState('email');
    }
  };

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

      {state === 'email' ? (
        <>
          <h1 className="text-3xl font-black text-white">Use a different email for your account?</h1>
          <p className="mt-4 text-slate-300">
            Enter the checkout email. We will send a one-time code to verify you own it, then link this paid purchase to the account you are signed in to.
          </p>
          <form
            className="mx-auto mt-6 max-w-sm space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void sendCheckoutCode();
            }}
          >
            <label htmlFor="checkout-email" className="sr-only">Checkout email</label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              required
              value={checkoutEmail}
              onChange={(event) => setCheckoutEmail(event.target.value)}
              placeholder="Email used at checkout"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-300/50"
            />
            {message ? <p role="alert" className="text-sm text-amber-200">{message}</p> : null}
            <button type="submit" className="primary-btn w-full">Send verification code</button>
          </form>
          <p className="mt-5 text-xs text-slate-400">Order ID: {orderId}</p>
        </>
      ) : null}

      {state === 'email-sent' ? (
        <>
          <h1 className="text-3xl font-black text-white">Check your email</h1>
          <p role="status" className="mt-4 text-slate-300">{message}</p>
          <p className="mt-2 text-sm text-slate-400">{checkoutEmail}</p>
          <p className="mt-5 text-sm text-slate-400">
            Open the verification link on this device. After verification, your purchase will be linked to the account you signed in with.
          </p>
          <button type="button" onClick={() => { setMessage(''); setState('email'); }} className="secondary-btn mt-6">
            Use another checkout email
          </button>
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
