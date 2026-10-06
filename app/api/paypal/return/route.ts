import { NextResponse } from 'next/server';

import { capturePayPalOrder } from '@/lib/paypal';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const orderId = requestUrl.searchParams.get('orderId');
  const paypalOrderId = requestUrl.searchParams.get('token');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  const successUrl = new URL('/success', siteUrl);
  const checkoutUrl = new URL('/checkout', siteUrl);

  if (!orderId || !paypalOrderId) {
    checkoutUrl.searchParams.set('payment', 'incomplete');
    return NextResponse.redirect(checkoutUrl);
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    successUrl.searchParams.set('orderId', orderId);
    successUrl.searchParams.set('payment', 'verification-pending');
    return NextResponse.redirect(successUrl);
  }

  const { data: order, error: lookupError } = await admin
    .from('store_orders')
    .select('id, provider_order_id, status')
    .eq('id', orderId)
    .eq('payment_provider', 'paypal')
    .maybeSingle();

  if (lookupError) {
    console.error('Unable to look up PayPal return order', lookupError);
    successUrl.searchParams.set('orderId', orderId);
    successUrl.searchParams.set('payment', 'verification-pending');
    return NextResponse.redirect(successUrl);
  }

  if (!order || order.provider_order_id !== paypalOrderId) {
    checkoutUrl.searchParams.set('payment', 'order-mismatch');
    return NextResponse.redirect(checkoutUrl);
  }

  if (order.status !== 'paid') {
    try {
      const captured = await capturePayPalOrder(paypalOrderId);
      if (!captured) {
        successUrl.searchParams.set('orderId', orderId);
        successUrl.searchParams.set('payment', 'verification-pending');
        return NextResponse.redirect(successUrl);
      }

      const { error: updateError } = await admin
        .from('store_orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('provider_order_id', paypalOrderId)
        .eq('payment_provider', 'paypal');

      if (updateError) {
        console.error('Unable to record captured PayPal order', updateError);
        successUrl.searchParams.set('orderId', orderId);
        successUrl.searchParams.set('payment', 'verification-pending');
        return NextResponse.redirect(successUrl);
      }
    } catch (error: unknown) {
      console.error('PayPal capture failed', error);
      successUrl.searchParams.set('orderId', orderId);
      successUrl.searchParams.set('payment', 'verification-pending');
      return NextResponse.redirect(successUrl);
    }
  }

  successUrl.searchParams.set('orderId', orderId);
  successUrl.searchParams.set('payment', 'verified');
  return NextResponse.redirect(successUrl);
}
