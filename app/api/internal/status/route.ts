// ============================================================
// PHILinspect — GET /api/internal/status
// Protected endpoint for internal settings page.
// Returns connection status only — never API keys or secrets.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isGoogleMapsConfigured } from '@/lib/google-maps';
import { isGoogleSheetsConfigured } from '@/lib/google-sheets';
import { isZohoCRMConfigured } from '@/lib/zoho-crm';
import { isZohoBooksConfigured } from '@/lib/zoho-books';

const INTERNAL_PASSWORD = process.env.INTERNAL_SETTINGS_PASSWORD ?? '';

export async function GET(request: NextRequest) {
  // Password check via Authorization header or query param
  const authHeader = request.headers.get('x-internal-password');
  const queryPassword = request.nextUrl.searchParams.get('password');
  const provided = authHeader ?? queryPassword ?? '';

  if (!INTERNAL_PASSWORD || provided !== INTERNAL_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    googleMaps: isGoogleMapsConfigured() ? 'connected' : 'not_configured',
    googleSheets: isGoogleSheetsConfigured() ? 'connected' : 'not_configured',
    zohoCRM: isZohoCRMConfigured() ? 'connected' : 'not_configured',
    zohoBooks: isZohoBooksConfigured() ? 'connected' : 'not_configured',
    zohoBooksFlagEnabled: process.env.ENABLE_ZOHO_BOOKS === 'true',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
