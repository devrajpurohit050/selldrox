import { CheckoutEmailVerification } from '@/components/checkout-email-verification';

export default function CheckoutEmailVerifiedPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return <CheckoutEmailVerification orderId={searchParams.orderId ?? ''} />;
}
