export type PaymentProvider = 'cashfree' | 'paypal';
export type CurrencyCode = 'INR' | 'USD';

export type CheckoutRequest = {
  currency: CurrencyCode;
  productId: string;
  returnUrl?: string;
};
