import { PostPaymentAccount } from '@/components/post-payment-account';

export default function SuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId?.trim();

  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-2xl rounded-[32px] p-8 text-center md:p-12">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">
          {orderId ? 'Payment verification' : 'Order verification required'}
        </div>
        {orderId ? (
          <PostPaymentAccount orderId={orderId} />
        ) : (
          <>
            <h1 className="mt-6 text-4xl font-black text-white">This page cannot confirm a purchase by itself.</h1>
            <p className="mt-4 text-slate-300">A valid paid order is required before SELLDROX access can be delivered.</p>
          </>
        )}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm text-slate-300">
          Account access is only granted after the payment provider confirms your payment.
        </div>
      </div>
    </main>
  );
}
