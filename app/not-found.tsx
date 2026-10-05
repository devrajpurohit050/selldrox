export default function NotFoundPage() {
  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="glass-panel max-w-xl rounded-[28px] p-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">404</div>
        <h1 className="mt-4 text-4xl font-black text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you requested could not be found.</p>
      </div>
    </main>
  );
}
