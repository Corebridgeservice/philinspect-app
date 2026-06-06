// ============================================================
// PHILinspect — GET /api/health
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'PHILinspect Assessment API',
    timestamp: new Date().toISOString(),
  });
}
