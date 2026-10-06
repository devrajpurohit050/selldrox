import { Check } from 'lucide-react';

export default function SuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId?.trim();

  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-2xl rounded-[32px] p-8 text-center md:p-12">
        {orderId ? (
          <div className="success-tick-pop mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_34px_rgba(16,185,129,0.34)]">
            <Check className="success-tick-draw h-7 w-7" strokeWidth={3.5} aria-hidden="true" />
          </div>
        ) : null}
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">
          {orderId ? 'Payment verification' : 'Order verification required'}
        </div>
        <h1 className="mt-6 text-4xl font-black text-white">
          {orderId ? 'We are verifying your payment.' : 'This page cannot confirm a purchase by itself.'}
        </h1>
        <p className="mt-4 text-slate-300">
          {orderId
            ? `Order ID: ${orderId}`
            : 'A valid paid order is required before SELLDROX access can be delivered.'}
        </p>
        <p className="mt-6 text-slate-300">
          If your payment was completed, your access will be prepared after payment verification. Keep your order ID and contact support if access is delayed.
        </p>
        <div className="mt-8 text-left rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          Direct links do not unlock the product. Downloads are released only after a verified paid order.
        </div>
      </div>
    </main>
  );
}
