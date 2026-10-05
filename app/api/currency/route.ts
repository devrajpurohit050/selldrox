import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  currency: z.enum(['INR', 'USD']),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid currency selection.' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, currency: parsed.data.currency });
  response.cookies.set('selldrox_currency', parsed.data.currency, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
