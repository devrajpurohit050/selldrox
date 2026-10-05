import { cookies, headers } from 'next/headers';

import type { CurrencyCode } from '@/types/payment';

const DEFAULT_CURRENCY: CurrencyCode = 'USD';
const PREFERRED_CURRENCY_COOKIE = 'selldrox_currency';

export function resolveDefaultCurrency(countryCode?: string | null): CurrencyCode {
  return countryCode?.trim().toUpperCase() === 'IN' ? 'INR' : DEFAULT_CURRENCY;
}

export function getCurrencyPreference(): CurrencyCode {
  const cookieStore = cookies();
  const saved = cookieStore.get(PREFERRED_CURRENCY_COOKIE)?.value as CurrencyCode | undefined;
  if (saved === 'INR' || saved === 'USD') {
    return saved;
  }

  const headerList = headers();
  const country = headerList.get('x-vercel-ip-country') || headerList.get('x-country-code');
  return resolveDefaultCurrency(country);
}

export function shouldDetectCurrencyInBrowser(): boolean {
  const saved = cookies().get(PREFERRED_CURRENCY_COOKIE)?.value;
  if (saved === 'INR' || saved === 'USD') {
    return false;
  }

  const headerList = headers();
  return !headerList.get('x-vercel-ip-country') && !headerList.get('x-country-code');
}

export function setCurrencyPreference(currency: CurrencyCode) {
  const cookieStore = cookies();
  cookieStore.set(PREFERRED_CURRENCY_COOKIE, currency, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function getCurrencyFromRequest(countryCode?: string | null, manualCurrency?: string | null): CurrencyCode {
  if (manualCurrency === 'INR' || manualCurrency === 'USD') {
    return manualCurrency;
  }

  return resolveDefaultCurrency(countryCode ?? 'US');
}
