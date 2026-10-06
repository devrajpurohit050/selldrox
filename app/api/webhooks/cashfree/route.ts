import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-webhook-signature');
  const timestamp = request.headers.get('x-webhook-timestamp');
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!signature || !timestamp || !secretKey) {
    return NextResponse.json({ ok: false, error: 'Webhook verification is not configured.' }, { status: 401 });
  }

  const expectedSignature = createHmac('sha256', secretKey)
    .update(timestamp + rawBody)
    .digest('base64');
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook signature.' }, { status: 401 });
  }

  let event: {
    data?: {
      order?: { order_id?: string };
      payment?: { payment_status?: string };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid webhook payload.' }, { status: 400 });
  }

  if (event.data?.payment?.payment_status !== 'SUCCESS') {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const orderId = event.data.order?.order_id;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Missing Cashfree order ID.' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Order storage is not configured.' }, { status: 503 });
  }

  const { data, error } = await admin
    .from('store_orders')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('payment_provider', 'cashfree')
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Unable to record Cashfree payment', error);
    return NextResponse.json({ ok: false, error: 'Unable to record payment.' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
