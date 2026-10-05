import { NextResponse } from 'next/server';

import { contactSchema } from '@/lib/security';

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please provide valid contact details.' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Your message has been received. Support will respond soon.',
  });
}
