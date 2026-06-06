// ============================================================
// PHILinspect — Google Sheets Integration (Server-side)
// PRIVATE: All pricing data is internal only.
// ============================================================

import { google } from 'googleapis';
import { AssessmentData, InternalPricingResult } from '@/types/assessment';
import {
  USER_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from '@/config/routing';
import { SERVICES } from '@/config/services';
import { ADD_ONS } from '@/config/packages';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? '';
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? '';
const PRIVATE_KEY = (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');

export interface SheetsResult {
  success: boolean;
  error?: string;
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Append a full assessment + pricing row to Google Sheets.
 * All pricing fields are included for internal team use.
 */
export async function appendAssessmentToSheets(
  assessment: AssessmentData,
  pricing: InternalPricingResult,
  timestamp: string
): Promise<SheetsResult> {
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.warn('[google-sheets] Not fully configured — skipping Sheets append.');
    return { success: false, error: 'Google Sheets not configured' };
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const addOnsLabel = assessment.selectedAddOns
      .map((a) => ADD_ONS[a]?.label ?? a)
      .join(', ') || 'None';

    const row = [
      timestamp,
      assessment.fullName,
      assessment.mobile,
      assessment.email,
      assessment.viber || '',
      assessment.whatsapp || '',
      USER_TYPE_LABELS[assessment.userType!] ?? assessment.userType ?? '',
      PROPERTY_TYPE_LABELS[assessment.propertyType!] ?? assessment.propertyType ?? '',
      SERVICES[assessment.recommendedService!]?.label ?? assessment.recommendedService ?? '',
      assessment.packageChoice ?? '',
      addOnsLabel,
      assessment.propertyAddress,
      assessment.floorArea?.toString() ?? '',
      assessment.numberOfFloors?.toString() ?? '',
      assessment.furnished === true ? 'Furnished' : assessment.furnished === false ? 'Unfurnished' : '',
      assessment.occupied === true ? 'Occupied' : assessment.occupied === false ? 'Vacant' : '',
      assessment.preferredInspectionDate || '',
      pricing.distanceKm?.toString() ?? 'N/A',
      pricing.mobilizationFee.toString(),
      pricing.baseFee.toString(),
      pricing.additionalSqmFee.toString(),
      pricing.addOnsTotal.toString(),
      pricing.discount.toString(),
      pricing.estimatedTotal.toString(),
      pricing.customReviewRequired ? 'Yes' : 'No',
      assessment.preferredCallDate || '',
      assessment.preferredCallTime || '',
      (assessment as any).bestContactMethod || '',
      (assessment as any).hearAboutUs || '',
      'New Lead',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[google-sheets] Append failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Check if Google Sheets is configured.
 */
export function isGoogleSheetsConfigured(): boolean {
  return Boolean(SPREADSHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);
}
