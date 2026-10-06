import type { CurrencyCode, PaymentProvider } from '@/types/payment';
import { randomUUID } from 'crypto';

export function getPaymentProvider(currency: CurrencyCode): PaymentProvider {
  return currency === 'INR' ? 'cashfree' : 'paypal';
}

export function createServerCheckoutPayload(currency: CurrencyCode, productId: string) {
  return {
    provider: getPaymentProvider(currency),
    currency,
    productId,
    orderId: `SDX-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`,
    amount: currency === 'INR' ? 299 : 16,
    mode: 'server_verified',
  };
}

export function isValidOrderAmount(currency: CurrencyCode, amount: number) {
  return (currency === 'INR' && amount === 299) || (currency === 'USD' && amount === 16);
}
