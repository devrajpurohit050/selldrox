'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-xl rounded-[28px] p-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Error</div>
        <h1 className="mt-4 text-4xl font-black text-white">Something went wrong</h1>
        <p className="mt-4 text-slate-300">The page could not be loaded. Please try again.</p>
        <button onClick={() => reset()} className="primary-btn mt-6">Try again</button>
      </div>
    </main>
  );
}
