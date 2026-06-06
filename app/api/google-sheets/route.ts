// ============================================================
// PHILinspect — POST /api/google-sheets
// Standalone endpoint to manually trigger a Sheets append.
// Protected by internal password.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { appendAssessmentToSheets } from '@/lib/google-sheets';

const INTERNAL_PASSWORD = process.env.INTERNAL_SETTINGS_PASSWORD ?? '';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-internal-password');
  if (!INTERNAL_PASSWORD || authHeader !== INTERNAL_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assessment, pricing, timestamp } = await request.json();
    const result = await appendAssessmentToSheets(assessment, pricing, timestamp ?? new Date().toISOString());
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
