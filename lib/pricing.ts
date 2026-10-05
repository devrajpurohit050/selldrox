import type { CurrencyCode } from '@/types/payment';

export const pricingConfig: Record<CurrencyCode, { amount: number; currency: CurrencyCode; symbol: string }> = {
  INR: { amount: 299, currency: 'INR', symbol: '₹' },
  USD: { amount: 16, currency: 'USD', symbol: '$' },
};

export function getPriceForCurrency(currency: CurrencyCode) {
  return pricingConfig[currency];
}

export function formatPrice(currency: CurrencyCode, amountValue?: number) {
  const config = getPriceForCurrency(currency);
  const value = amountValue ?? config.amount;
  return `${config.symbol}${value}`;
}

export function getCheckoutPrice(currency: CurrencyCode) {
  return pricingConfig[currency].amount;
}
