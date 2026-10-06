import Link from 'next/link';

export default function DownloadTokenPage({ params }: { params: { token: string } }) {
  const hasToken = params.token && params.token.length > 8;

  return (
    <main className="container-shell py-20">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Secure delivery</div>
        <h1 className="mt-4 text-3xl font-black text-white">{hasToken ? 'Download verification required' : 'Invalid access token'}</h1>
        <p className="mt-4 text-slate-300">
          {hasToken
            ? 'This token must be verified against a paid order before product access can be released.'
            : 'This token is invalid or expired. Please check your order details or contact support.'}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/account" className={hasToken ? 'secondary-btn' : 'primary-btn'}>Go to account</Link>
          <Link href="/contact" className="secondary-btn">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
