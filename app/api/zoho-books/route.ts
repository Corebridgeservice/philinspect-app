// ============================================================
// PHILinspect — POST /api/zoho-books
// Standalone endpoint to manually trigger Zoho Books estimate.
// Protected by internal password.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createZohoBooksContact, createZohoBooksEstimate } from '@/lib/zoho-books';

const INTERNAL_PASSWORD = process.env.INTERNAL_SETTINGS_PASSWORD ?? '';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-internal-password');
  if (!INTERNAL_PASSWORD || authHeader !== INTERNAL_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assessment, pricing } = await request.json();

    const contactResult = await createZohoBooksContact(assessment);
    if (!contactResult.success || !contactResult.contactId) {
      return NextResponse.json({ success: false, error: contactResult.error ?? 'Contact creation failed' });
    }

    const estimateResult = await createZohoBooksEstimate(assessment, pricing, contactResult.contactId);
    return NextResponse.json(estimateResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
