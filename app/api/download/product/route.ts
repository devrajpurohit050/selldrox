import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'A verified paid order is required before download access is released.' },
    { status: 403, headers: { 'Cache-Control': 'private, no-store' } },
  );
}
