import { ProductDownload } from '@/components/product-download';

export default function SuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-2xl rounded-[32px] p-8 text-center md:p-12">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Payment successful</div>
        <h1 className="mt-6 text-4xl font-black text-white">Your SELLDROX purchase is confirmed.</h1>
        <p className="mt-4 text-slate-300">Order ID: {searchParams.orderId || 'SDX-XXXXXXXX'}</p>
        <ProductDownload />
        <div className="mt-8 text-left rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          Keep this file safe after downloading. Payment details are never exposed here.
        </div>
      </div>
    </main>
  );
}
