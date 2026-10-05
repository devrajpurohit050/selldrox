import type { CurrencyCode, PaymentProvider } from '@/types/payment';

export function getPaymentProvider(currency: CurrencyCode): PaymentProvider {
  return currency === 'INR' ? 'cashfree' : 'paypal';
}

export function createServerCheckoutPayload(currency: CurrencyCode, productId: string) {
  return {
    provider: getPaymentProvider(currency),
    currency,
    productId,
    orderId: `SDX-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    amount: currency === 'INR' ? 299 : 16,
    mode: 'server_verified',
  };
}

export function isValidOrderAmount(currency: CurrencyCode, amount: number) {
  return (currency === 'INR' && amount === 299) || (currency === 'USD' && amount === 16);
}
