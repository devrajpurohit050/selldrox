import { NextResponse } from 'next/server';

import { checkoutSchema } from '@/lib/security';
import { createServerCheckoutPayload } from '@/lib/payments';
import { createCashfreePaymentLink } from '@/lib/cashfree';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid checkout payload' }, { status: 400 });
  }

  const payload = createServerCheckoutPayload(parsed.data.currency, parsed.data.productId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  if (payload.provider === 'paypal') {
    try {
      const returnUrl = new URL(parsed.data.returnUrl || '/success', siteUrl);
      returnUrl.searchParams.set('orderId', payload.orderId);

      const cancelUrl = new URL('/checkout', siteUrl);
      const paypalOrder = await createPayPalOrder({
        amount: payload.amount,
        currency: 'USD',
        orderId: payload.orderId,
        returnUrl: returnUrl.toString(),
        cancelUrl: cancelUrl.toString(),
      });

      return NextResponse.json({
        ok: true,
        provider: payload.provider,
        amount: payload.amount,
        currency: payload.currency,
        orderId: payload.orderId,
        providerOrderId: paypalOrder.paypalOrderId,
        mode: payload.mode,
        redirectUrl: paypalOrder.approvalUrl,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to create PayPal checkout.';
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }

  if (payload.provider === 'cashfree') {
    try {
      const returnUrl = new URL('/success', siteUrl);
      returnUrl.searchParams.set('orderId', payload.orderId);

      const notifyUrl = new URL('/api/webhooks/cashfree', siteUrl);
      const cashfreeLink = await createCashfreePaymentLink({
        amount: payload.amount,
        currency: 'INR',
        orderId: payload.orderId,
        returnUrl: returnUrl.toString(),
        notifyUrl: notifyUrl.toString(),
      });

      return NextResponse.json({
        ok: true,
        provider: payload.provider,
        amount: payload.amount,
        currency: payload.currency,
        orderId: payload.orderId,
        providerOrderId: cashfreeLink.linkId,
        mode: payload.mode,
        redirectUrl: cashfreeLink.paymentUrl,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to create Cashfree checkout.';
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }

  return NextResponse.json({
    ok: true,
    provider: payload.provider,
    amount: payload.amount,
    currency: payload.currency,
    orderId: payload.orderId,
    mode: payload.mode,
    redirectUrl: parsed.data.returnUrl || `/success?orderId=${payload.orderId}`,
  });
}
