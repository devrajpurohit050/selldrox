import Link from 'next/link';
import Image from 'next/image';

import { formatPrice, getPriceForCurrency } from '@/lib/pricing';
import { getCurrencyPreference } from '@/lib/currency';
import { CheckoutButton } from '@/components/checkout-button';

export default async function CheckoutPage() {
  const preferred = getCurrencyPreference();
  const price = getPriceForCurrency(preferred);
  const paymentIcon =
    preferred === 'INR' ? '/asstes/inr%20payment%20icon.png' : '/asstes/usd%20payment%20icon.webp';
  const paymentMethod = preferred === 'INR' ? 'Cashfree (India)' : 'PayPal (International)';

  return (
    <main className="container-shell py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Checkout</div>
          <h1 className="text-4xl font-black text-white md:text-5xl">Secure your SELLDROX access</h1>
          <div className="glass-panel rounded-[28px] p-5">
            <div className="flex gap-4">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                <Image src="/asstes/Digital Product Banner.png" alt="SELLDROX bundle preview" width={180} height={180} className="h-28 w-28 object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-white">SELLDROX Ultimate Digital Vault</div>
                <p className="mt-2 text-sm text-slate-300">A premium bundle of templates, code, AI resources, creative assets and business tools.</p>
                <div className="mt-4 text-2xl font-black text-white">{formatPrice(preferred)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Payment method</div>
          <div className="mt-4 flex min-h-[88px] items-center gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white">
              <Image src={paymentIcon} alt="" width={72} height={40} className="max-h-10 w-auto object-contain" />
            </div>
            <div>
              <div className="text-base font-bold text-white">{paymentMethod}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-blue-100/80">{preferred} payment</div>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Product</span><span>SELLDROX Digital Vault</span></div>
            <div className="flex justify-between"><span>Currency</span><span>{preferred}</span></div>
            <div className="flex justify-between"><span>Amount</span><span>{formatPrice(preferred)}</span></div>
          </div>
          <CheckoutButton currency={preferred} />
          <div className="mt-6 text-center text-xs text-slate-400">
            Secure checkout - Verified order - Temporary access after successful payment
          </div>
          <div className="mt-4 text-center text-sm text-slate-300">
            Sign in is required to link orders to your account. <Link href="/login" className="text-blue-200">Login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
