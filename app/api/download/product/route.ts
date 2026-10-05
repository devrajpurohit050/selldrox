import { readFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const productFileName = 'Digi Selling Website.pdf';

export async function GET() {
  const filePath = path.join(process.cwd(), 'Product', productFileName);

  try {
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${productFileName}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Product file is not available.' }, { status: 404 });
  }
}
