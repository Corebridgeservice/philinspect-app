// ============================================================
// PHILinspect — POST /api/zoho-crm
// Standalone endpoint to manually trigger Zoho CRM Lead creation.
// Protected by internal password.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createZohoLead } from '@/lib/zoho-crm';

const INTERNAL_PASSWORD = process.env.INTERNAL_SETTINGS_PASSWORD ?? '';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-internal-password');
  if (!INTERNAL_PASSWORD || authHeader !== INTERNAL_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assessment, pricing } = await request.json();
    const result = await createZohoLead(assessment, pricing);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
