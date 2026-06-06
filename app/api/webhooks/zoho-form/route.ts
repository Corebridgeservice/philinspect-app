// ============================================================
// PHILinspect — POST /api/webhooks/zoho-form
// Accepts Zoho Form submissions and normalizes them into the
// internal assessment and pricing engine.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { AssessmentData } from '@/types/assessment';
import { calculateInternalQuote } from '@/lib/pricing-engine';
import { calculateDistanceFromOffice } from '@/lib/google-maps';
import { appendAssessmentToSheets } from '@/lib/google-sheets';
import { createZohoLead } from '@/lib/zoho-crm';

/**
 * Normalize a Zoho Form payload into AssessmentData.
 * Field names must match your Zoho Form field IDs.
 */
function normalizeZohoFormPayload(body: Record<string, unknown>): AssessmentData {
  return {
    userType: (body.user_type as AssessmentData['userType']) ?? null,
    propertyType: (body.property_type as AssessmentData['propertyType']) ?? null,
    ownerSituation: (body.owner_situation as AssessmentData['ownerSituation']) ?? null,
    recommendedService: (body.recommended_service as AssessmentData['recommendedService']) ?? null,
    packageChoice: (body.package_choice as AssessmentData['packageChoice']) ?? null,
    selectedAddOns: Array.isArray(body.add_ons) ? body.add_ons : [],
    propertyAddress: (body.property_address as string) ?? '',
    propertyAddressPlaceId: (body.place_id as string) ?? '',
    floorArea: body.floor_area ? Number(body.floor_area) : null,
    numberOfFloors: body.number_of_floors ? Number(body.number_of_floors) : null,
    furnished: body.furnished === 'true' || body.furnished === true,
    occupied: body.occupied === 'true' || body.occupied === true,
    preferredInspectionDate: (body.preferred_inspection_date as string) ?? '',
    fullName: (body.full_name as string) ?? '',
    mobile: (body.mobile as string) ?? '',
    email: (body.email as string) ?? '',
    viber: (body.viber as string) ?? '',
    whatsapp: (body.whatsapp as string) ?? '',
    preferredCallDate: (body.preferred_call_date as string) ?? '',
    preferredCallTime: (body.preferred_call_time as string) ?? '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessment = normalizeZohoFormPayload(body);
    const timestamp = new Date().toISOString();

    // Calculate distance
    let distanceKm: number | null = null;
    if (assessment.propertyAddress) {
      const distanceResult = await calculateDistanceFromOffice(assessment.propertyAddress);
      distanceKm = distanceResult.distanceKm;
    }

    // Calculate internal pricing
    const pricing = calculateInternalQuote(assessment, distanceKm);

    // Send to integrations
    appendAssessmentToSheets(assessment, pricing, timestamp).catch(console.error);
    createZohoLead(assessment, pricing).catch(console.error);

    return NextResponse.json({ success: true, message: 'Zoho Form webhook processed.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[zoho-form-webhook] Error:', message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
