"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Globe, Menu, MoonStar, SunMedium, User } from 'lucide-react';

import type { CurrencyCode } from '@/types/payment';

export function Navbar({
  initialCurrency,
  detectCurrencyInBrowser,
}: {
  initialCurrency: CurrencyCode;
  detectCurrencyInBrowser: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const browserCurrencyDetectionStarted = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selldrox-theme');
    const nextTheme = savedTheme === 'dark';
    if (savedTheme === null) {
      localStorage.setItem('selldrox-theme', 'light');
    }
    setIsDark(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme);
    document.documentElement.dataset.theme = nextTheme ? 'dark' : 'light';
    document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    if (!detectCurrencyInBrowser || browserCurrencyDetectionStarted.current) {
      return;
    }
    browserCurrencyDetectionStarted.current = true;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIndiaLocale = /-IN(?:-|$)/i.test(navigator.language);
    const browserCurrency: CurrencyCode =
      timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta' || isIndiaLocale ? 'INR' : 'USD';

    if (browserCurrency === currency) {
      return;
    }

    let cancelled = false;
    void fetch('/api/currency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency: browserCurrency }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Currency preference request failed with status ${response.status}`);
        }
        if (!cancelled) {
          setCurrency(browserCurrency);
          router.refresh();
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to apply the detected currency preference.', error);
      });

    return () => {
      cancelled = true;
    };
  }, [currency, detectCurrencyInBrowser, router]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('selldrox-theme', nextTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme);
    document.documentElement.dataset.theme = nextTheme ? 'dark' : 'light';
    document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light';
  };

  const handleCurrency = async (value: CurrencyCode) => {
    try {
      const response = await fetch('/api/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: value }),
      });
      if (!response.ok) {
        throw new Error(`Currency preference request failed with status ${response.status}`);
      }

      setCurrency(value);
      router.refresh();
    } catch (error) {
      console.error('Unable to save the currency preference.', error);
    }
  };

  const shellClasses = isDark
    ? 'border-white/10 bg-slate-950/75 text-white'
    : 'border-slate-200 bg-white/80 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)]';

  const controlClasses = isDark
    ? 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10'
    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100';

  const linkClasses = isDark ? 'text-slate-100' : 'text-slate-800';
  const currencyOptions: CurrencyCode[] = ['INR', 'USD'];

  const currencyToggle = (label: string) => (
    <div
      className={`flex items-center gap-2 rounded-full border p-1 ${controlClasses}`}
      role="group"
      aria-label={label}
    >
      <Globe className={`ml-2 h-4 w-4 ${isDark ? 'text-blue-200' : 'text-blue-600'}`} />
      <div className="grid grid-cols-2 rounded-full">
        {currencyOptions.map((option) => {
          const isSelected = currency === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleCurrency(option)}
              aria-pressed={isSelected}
              className={`h-8 min-w-12 rounded-full px-3 text-xs font-bold transition ${
                isSelected
                  ? isDark
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-white shadow-sm'
                  : isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${shellClasses}`}>
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border p-1 ${isDark ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
            <Image
              src="/asstes/selldrox%20logo.png"
              alt="SELLDROX logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className={`text-lg font-black tracking-[0.18em] ${linkClasses}`}>SELLDROX</div>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {currencyToggle('Select currency')}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${controlClasses}`}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>

          {pathname !== '/checkout' ? (
            <Link href="/account" className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${controlClasses}`}>
              <User className="h-4 w-4" />
              Account
            </Link>
          ) : null}
          <Link href="/checkout" className="primary-btn">GET ACCESS</Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${controlClasses}`}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
          <button type="button" className={`flex h-10 w-10 items-center justify-center rounded-full border ${controlClasses}`} onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="container-shell pb-4 md:hidden">
          <div className={`space-y-3 rounded-2xl border p-4 text-sm ${isDark ? 'border-white/10 bg-slate-900/90 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
            <Link href="/#inside" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/#inside" onClick={() => setOpen(false)}>What&apos;s Inside</Link>
            <Link href="/#inside" onClick={() => setOpen(false)}>Benefits</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>FAQ</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <div className="pt-2">
              {currencyToggle('Mobile currency selector')}
            </div>
            {pathname !== '/checkout' ? (
              <Link href="/account" onClick={() => setOpen(false)} className={`block rounded-xl border px-3 py-2 ${isDark ? 'border-white/10 bg-white/5 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>Account</Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
