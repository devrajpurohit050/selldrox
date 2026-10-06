import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { getSupabaseAdminClient } from '@/lib/supabase';

const requestSchema = z.object({
  orderId: z.string().regex(/^SDX-[A-F0-9]{16}$/),
  checkoutEmail: z.string().trim().email().max(254),
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
    return NextResponse.json({ ok: false, error: 'Sign in with a verified account before linking this purchase.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid email verification request.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Enter the email address used at checkout.' }, { status: 400 });
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
    console.error('Unable to look up order for email verification', lookupError);
    return NextResponse.json({ ok: false, error: 'Unable to verify this purchase.' }, { status: 500 });
  }
  if (!order || order.buyer_email?.toLowerCase() !== parsed.data.checkoutEmail.toLowerCase()) {
    return NextResponse.json({ ok: false, error: 'The email does not match this order.' }, { status: 404 });
  }
  if (order.user_id && order.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'This order is already linked to another account.' }, { status: 409 });
  }
  if (order.status !== 'paid') {
    return NextResponse.json({ ok: false, error: 'Payment is not verified yet. Please try again shortly.' }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
