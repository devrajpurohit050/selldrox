import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { checkoutSchema } from '@/lib/security';
import { createServerCheckoutPayload } from '@/lib/payments';
import { createCashfreeOrder } from '@/lib/cashfree';
import { createPayPalOrder } from '@/lib/paypal';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let authenticatedUser: { id: string; email: string } | null = null;
  if (accessToken && supabaseUrl && anonKey) {
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser(accessToken);
    if (!authError && user?.email) {
      authenticatedUser = { id: user.id, email: user.email };
    }
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Order storage is not configured. Please contact support.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid checkout payload' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid checkout payload' }, { status: 400 });
  }

  const payload = createServerCheckoutPayload(parsed.data.currency, parsed.data.productId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const buyerEmail = parsed.data.buyerEmail.toLowerCase();
  const linkedUserId = authenticatedUser?.email.toLowerCase() === buyerEmail ? authenticatedUser.id : null;
  const { error: insertError } = await admin.from('store_orders').insert({
    id: payload.orderId,
    user_id: linkedUserId,
    buyer_email: buyerEmail,
    product_id: payload.productId,
    currency: payload.currency,
    amount: payload.amount,
    payment_provider: payload.provider,
    status: 'pending',
  });

  if (insertError) {
    console.error('Unable to save account order', insertError);
    return NextResponse.json({ ok: false, error: 'Unable to save your order. Please try again.' }, { status: 500 });
  }

  if (payload.provider === 'paypal') {
    try {
      const returnUrl = new URL('/api/paypal/return', siteUrl);
      returnUrl.searchParams.set('orderId', payload.orderId);

      const cancelUrl = new URL('/checkout', siteUrl);
      const paypalOrder = await createPayPalOrder({
        amount: payload.amount,
        currency: 'USD',
        orderId: payload.orderId,
        buyerName: parsed.data.buyerName,
        buyerEmail,
        returnUrl: returnUrl.toString(),
        cancelUrl: cancelUrl.toString(),
      });

      const { error: updateError } = await admin
        .from('store_orders')
        .update({ provider_order_id: paypalOrder.paypalOrderId })
        .eq('id', payload.orderId)
        .eq('buyer_email', buyerEmail);
      if (updateError) {
        console.error('Unable to attach PayPal order to account', updateError);
        return NextResponse.json({ ok: false, error: 'The payment was created, but the order could not be linked. Contact support before retrying.' }, { status: 500 });
      }

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
      const { error: updateError } = await admin
        .from('store_orders')
        .update({ status: 'failed' })
        .eq('id', payload.orderId)
        .eq('buyer_email', buyerEmail);
      if (updateError) console.error('Unable to mark PayPal order as failed', updateError);
      const message = error instanceof Error ? error.message : 'Unable to create PayPal checkout.';
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }

  if (payload.provider === 'cashfree') {
    try {
      const returnUrl = new URL('/success', siteUrl);
      returnUrl.searchParams.set('orderId', payload.orderId);

      const notifyUrl = new URL('/api/webhooks/cashfree', siteUrl);
      const cashfreeOrder = await createCashfreeOrder({
        amount: payload.amount,
        currency: 'INR',
        orderId: payload.orderId,
        buyerName: parsed.data.buyerName,
        buyerEmail,
        returnUrl: returnUrl.toString(),
        notifyUrl: notifyUrl.toString(),
      });

      const { error: updateError } = await admin
        .from('store_orders')
        .update({ provider_order_id: cashfreeOrder.orderId })
        .eq('id', payload.orderId)
        .eq('buyer_email', buyerEmail);
      if (updateError) {
        console.error('Unable to attach Cashfree order to account', updateError);
        return NextResponse.json({ ok: false, error: 'The payment was created, but the order could not be linked. Contact support before retrying.' }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        provider: payload.provider,
        amount: payload.amount,
        currency: payload.currency,
        orderId: payload.orderId,
        providerOrderId: cashfreeOrder.orderId,
        paymentSessionId: cashfreeOrder.paymentSessionId,
        mode: payload.mode,
      });
    } catch (error: unknown) {
      const { error: updateError } = await admin
        .from('store_orders')
        .update({ status: 'failed' })
        .eq('id', payload.orderId)
        .eq('buyer_email', buyerEmail);
      if (updateError) console.error('Unable to mark Cashfree order as failed', updateError);
      const message = error instanceof Error ? error.message : 'Unable to create Cashfree checkout.';
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }
}
