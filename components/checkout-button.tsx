"use client";

import { useState } from 'react';

import type { CurrencyCode } from '@/types/payment';

export function CheckoutButton({ currency }: { currency: CurrencyCode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency,
          productId: 'selldrox-digital-vault',
          returnUrl: `${window.location.origin}/success`,
        }),
      });

      const data: { ok?: boolean; error?: string; redirectUrl?: string } = await response.json();

      if (!response.ok || !data.ok || !data.redirectUrl) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      window.location.href = data.redirectUrl;
    } catch (checkoutError: unknown) {
      const message = checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={startCheckout} disabled={loading} className="primary-btn mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? 'Redirecting...' : 'Proceed to secure checkout'}
      </button>
      {error ? <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
    </>
  );
}
