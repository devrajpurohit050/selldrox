import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyPayPalWebhook } from '@/lib/paypal';

export async function POST(request: Request) {
  let event: {
    event_type?: string;
    resource?: { custom_id?: string };
  };

  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid webhook payload.' }, { status: 400 });
  }

  const headers = {
    'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
    'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
    'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
    'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
    'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
  };
  if (Object.values(headers).some((value) => !value)) {
    return NextResponse.json({ ok: false, error: 'Missing PayPal signature headers.' }, { status: 401 });
  }

  let verified: boolean;
  try {
    verified = await verifyPayPalWebhook(headers, event);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to verify PayPal webhook.';
    console.error(message);
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
  if (!verified) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook signature.' }, { status: 401 });
  }

  if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const orderId = event.resource?.custom_id;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Missing SELLDROX order ID.' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Order storage is not configured.' }, { status: 503 });
  }

  const { data, error } = await admin
    .from('store_orders')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('payment_provider', 'paypal')
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Unable to record PayPal payment', error);
    return NextResponse.json({ ok: false, error: 'Unable to record payment.' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
