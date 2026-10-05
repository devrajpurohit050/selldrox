import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const json = await request.json();
  const authHeader = request.headers.get('paypal-auth-algorithm');

  if (!authHeader) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, received: Boolean(json), status: 'queued' });
}
