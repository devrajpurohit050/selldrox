"use client";

import { useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

import type { CurrencyCode } from '@/types/payment';
import { getSupabaseClient } from '@/lib/supabase';

type CheckoutResponse = {
  ok?: boolean;
  error?: string;
  provider?: 'cashfree' | 'paypal';
  redirectUrl?: string;
  paymentSessionId?: string;
};

type CashfreeCheckoutResult = {
  error?: { message?: string } | string;
  paymentDetails?: unknown;
};

export function CheckoutButton({ currency }: { currency: CurrencyCode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  const startCheckout = async () => {
    const trimmedName = buyerName.trim();
    const trimmedEmail = buyerEmail.trim();

    if (trimmedName.length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = supabase ? await supabase.auth.getSession() : { data: { session: null } };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          currency,
          productId: 'selldrox-digital-vault',
          buyerName: trimmedName,
          buyerEmail: trimmedEmail,
        }),
      });

      const data: CheckoutResponse = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      if (data.provider === 'cashfree' || data.paymentSessionId) {
        if (!data.paymentSessionId) {
          throw new Error('Cashfree did not return a payment session.');
        }

        const cashfree = await load({ mode: 'production' });

        if (!cashfree) {
          throw new Error('Unable to load Cashfree checkout.');
        }

        const checkoutResult = (await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: '_self',
        })) as CashfreeCheckoutResult | undefined;

        if (checkoutResult?.error) {
          const cashfreeMessage =
            typeof checkoutResult.error === 'string'
              ? checkoutResult.error
              : checkoutResult.error.message || 'Cashfree checkout could not be opened.';
          throw new Error(cashfreeMessage);
        }

        return;
      }

      if (!data.redirectUrl) {
        throw new Error('Unable to start checkout.');
      }

      window.location.href = data.redirectUrl;
    } catch (checkoutError: unknown) {
      console.error('Checkout failed', checkoutError);
      const message =
        checkoutError instanceof Error && checkoutError.message
          ? checkoutError.message
          : typeof checkoutError === 'string' && checkoutError
            ? checkoutError
            : 'Unable to start checkout.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-7 space-y-4">
        <div>
          <label htmlFor="buyer-name" className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Buyer name
          </label>
          <input
            id="buyer-name"
            type="text"
            value={buyerName}
            onChange={(event) => setBuyerName(event.target.value)}
            autoComplete="name"
            placeholder="Enter your name"
            disabled={loading}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-300/50 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
        <div>
          <label htmlFor="buyer-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Email for your receipt and account
          </label>
          <input
            id="buyer-email"
            type="email"
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-300/50 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>
      <button type="button" onClick={startCheckout} disabled={loading} className="primary-btn mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? 'Redirecting...' : 'Proceed to secure checkout'}
      </button>
      <p className="mt-4 text-center text-xs text-slate-400">
        No account needed to pay. After payment, sign in or create an account using this same email to access your purchase.
      </p>
      {error ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}
    </>
  );
}
