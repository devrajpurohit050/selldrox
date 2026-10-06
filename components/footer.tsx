import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer border-t">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr] md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white p-1 shadow-[0_14px_34px_rgba(15,23,42,0.12)] dark:bg-slate-950/70">
              <Image
                src="/asstes/selldrox%20logo.png"
                alt="SELLDROX logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-2xl font-black tracking-[0.12em] text-white">SELLDROX</div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-300">Digital resources for creators, developers and entrepreneurs.</p>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</div>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div><Link href="/" className="transition hover:text-white">Home</Link></div>
            <div><Link href="/about" className="transition hover:text-white">About</Link></div>
            <div><Link href="/contact" className="transition hover:text-white">Contact</Link></div>
            <div><Link href="/contact" className="transition hover:text-white">FAQ</Link></div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Legal</div>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div><Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link></div>
            <div><Link href="/refund-policy" className="transition hover:text-white">Refund Policy</Link></div>
            <div><Link href="/disclaimer" className="transition hover:text-white">Disclaimer</Link></div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Currency</div>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
            <span>INR</span>
            <span className="text-slate-500">|</span>
            <span>USD</span>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom border-t">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            Copyright 2026 SELLDROX. All rights reserved by{' '}
            <a href="https://stexra.com" target="_blank" rel="noreferrer" className="transition hover:text-blue-600">
              Stexra
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
