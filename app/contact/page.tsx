import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="container-shell py-20">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/60 p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Contact support</div>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">We&apos;re here to help</h1>
          <p className="mt-6 text-slate-300">support@selldrox.com</p>
          <div className="mt-8 space-y-2 text-sm text-slate-300">
            <div>Payment issue</div>
            <div>Download issue</div>
            <div>Account issue</div>
            <div>Refund request</div>
            <div>Product question</div>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/60 p-8">
          <form className="space-y-4" action="/api/contact" method="POST">
            <input name="name" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Name" />
            <input name="email" type="email" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Email" />
            <input name="orderId" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Order ID (optional)" />
            <select name="category" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100">
              <option>Payment issue</option>
              <option>Download issue</option>
              <option>Account issue</option>
              <option>Refund request</option>
              <option>Product question</option>
              <option>Other</option>
            </select>
            <textarea name="message" rows={6} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Tell us how we can help" />
            <button type="submit" className="primary-btn w-full">Send message</button>
          </form>
          <div className="mt-4 text-sm text-slate-400">Support response time depends on the category and current queue.</div>
        </div>
      </div>
    </main>
  );
}
