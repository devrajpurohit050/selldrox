import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { getSupabaseAdminClient } from '@/lib/supabase';

const claimSchema = z.object({
  orderId: z.string().regex(/^SDX-[A-F0-9]{16}$/),
});

export async function POST(request: Request) {
  const accessToken = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !anonKey) {
    return NextResponse.json({ ok: false, error: 'Sign in to link this purchase to your account.' }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await authClient.auth.getUser(accessToken);
  if (authError || !user?.email || !user.email_confirmed_at) {
    return NextResponse.json({ ok: false, error: 'Use a verified account with the same email used at checkout.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid order claim request.' }, { status: 400 });
  }

  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid order ID.' }, { status: 400 });
  }

  const checkoutVerificationToken = request.headers.get('x-checkout-verification')?.trim();
  let verifiedCheckoutEmail: string | null = null;
  if (checkoutVerificationToken) {
    const { data: { user: checkoutUser }, error: checkoutAuthError } =
      await authClient.auth.getUser(checkoutVerificationToken);
    if (checkoutAuthError || !checkoutUser?.email || !checkoutUser.email_confirmed_at) {
      return NextResponse.json({ ok: false, error: 'The checkout email verification has expired. Request a new code.' }, { status: 401 });
    }
    verifiedCheckoutEmail = checkoutUser.email.toLowerCase();
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Order storage is not configured.' }, { status: 503 });
  }

  const { data: order, error: lookupError } = await admin
    .from('store_orders')
    .select('id, user_id, buyer_email, status')
    .eq('id', parsed.data.orderId)
    .maybeSingle();

  if (lookupError) {
    console.error('Unable to look up guest order', lookupError);
    return NextResponse.json({ ok: false, error: 'Unable to verify this purchase.' }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ ok: false, error: 'This order does not match your account email.' }, { status: 404 });
  }
  if (order.user_id && order.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'This order is already linked to another account.' }, { status: 409 });
  }
  if (order.status !== 'paid') {
    return NextResponse.json(
      { ok: false, pending: true, error: 'Payment confirmation is still pending. Try again shortly.' },
      { status: 202 },
    );
  }
  if (order.user_id === user.id) {
    return NextResponse.json({ ok: true, linked: true });
  }

  const buyerEmail = order.buyer_email?.toLowerCase();
  if (buyerEmail !== user.email.toLowerCase() && buyerEmail !== verifiedCheckoutEmail) {
    return NextResponse.json(
      { ok: false, needsEmailVerification: true, error: 'Verify the email used during checkout to link this purchase.' },
      { status: 403 },
    );
  }
  const { data: linkedOrder, error: linkError } = await admin
    .from('store_orders')
    .update({ user_id: user.id })
    .eq('id', parsed.data.orderId)
    .eq('status', 'paid')
    .is('user_id', null)
    .select('id')
    .maybeSingle();

  if (linkError) {
    console.error('Unable to link verified purchase to account', linkError);
    return NextResponse.json({ ok: false, error: 'Unable to link this purchase. Please try again.' }, { status: 500 });
  }
  if (!linkedOrder) {
    return NextResponse.json({ ok: false, error: 'This order could not be linked. Please contact support.' }, { status: 409 });
  }

  return NextResponse.json({ ok: true, linked: true });
}
