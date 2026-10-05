import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="container-shell py-20">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">About</div>
        <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">A digital resource platform built for practical access.</h1>
        <p className="mt-6 text-lg text-slate-300">SELLDROX exists to make quality digital resources easier to discover, organize, and access without the chaos of fragmented libraries and scattered payment trails.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="glass-panel rounded-3xl p-5"><h3 className="font-bold text-white">Mission</h3><p className="mt-3 text-slate-300">Simplify access to useful digital resources for creators, developers and entrepreneurs.</p></div>
          <div className="glass-panel rounded-3xl p-5"><h3 className="font-bold text-white">What we provide</h3><p className="mt-3 text-slate-300">Templates, source code, assets, learning resources, and business-focused tools.</p></div>
          <div className="glass-panel rounded-3xl p-5"><h3 className="font-bold text-white">Commitment</h3><p className="mt-3 text-slate-300">Transparent pricing, secure access, and support-first customer experience.</p></div>
        </div>
      </div>
    </main>
  );
}
