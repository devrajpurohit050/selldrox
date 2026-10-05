export type OrderStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export type OrderRecord = {
  id: string;
  userId?: string | null;
  productId: string;
  currency: 'INR' | 'USD';
  amount: number;
  paymentProvider: 'cashfree' | 'paypal';
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  status: OrderStatus;
  country: string;
  createdAt: string;
  paidAt?: string | null;
};
