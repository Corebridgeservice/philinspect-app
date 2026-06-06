// ============================================================
// PHILinspect — POST /api/submit-assessment
// Main submission endpoint: calculates pricing internally,
// sends to Google Sheets, Zoho CRM, and Zoho Books.
// NEVER returns pricing data to the client.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { AssessmentData } from '@/types/assessment';
import { calculateInternalQuote } from '@/lib/pricing-engine';
import { calculateDistanceFromOffice } from '@/lib/google-maps';
import { appendAssessmentToSheets } from '@/lib/google-sheets';
import { createZohoLead, createZohoDeal } from '@/lib/zoho-crm';
import { createZohoBooksContact, createZohoBooksEstimate } from '@/lib/zoho-books';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessment: AssessmentData = body.assessment;

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!assessment.fullName || !assessment.mobile || !assessment.email) {
      return NextResponse.json(
        { success: false, message: 'Full name, mobile, and email are required.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // ---- Step 1: Calculate distance (internal only) ----
    let distanceKm: number | null = null;
    if (assessment.propertyAddress) {
      const distanceResult = await calculateDistanceFromOffice(assessment.propertyAddress);
      distanceKm = distanceResult.distanceKm;
    }

    // ---- Step 2: Calculate internal pricing (never sent to client) ----
    const pricing = calculateInternalQuote(assessment, distanceKm);

    // ---- Step 3: Send to Google Sheets (fire and forget with logging) ----
    appendAssessmentToSheets(assessment, pricing, timestamp).catch((err) => {
      console.error('[submit-assessment] Google Sheets error:', err);
    });

    // ---- Step 4: Create Zoho CRM Lead ----
    const leadResult = await createZohoLead(assessment, pricing).catch((err) => {
      console.error('[submit-assessment] Zoho CRM Lead error:', err);
      return { success: false, leadId: undefined };
    });

    // ---- Step 5: Create Zoho CRM Deal (optional) ----
    if (leadResult.success && leadResult.leadId) {
      createZohoDeal(assessment, pricing, leadResult.leadId).catch((err) => {
        console.error('[submit-assessment] Zoho CRM Deal error:', err);
      });
    }

    // ---- Step 6: Zoho Books (feature-flagged) ----
    if (process.env.ENABLE_ZOHO_BOOKS === 'true') {
      createZohoBooksContact(assessment)
        .then((contactResult) => {
          if (contactResult.success && contactResult.contactId) {
            return createZohoBooksEstimate(assessment, pricing, contactResult.contactId);
          }
        })
        .catch((err) => {
          console.error('[submit-assessment] Zoho Books error:', err);
        });
    }

    // ---- Return ONLY customer-safe data ----
    // No pricing, no distances, no internal calculations
    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully.',
      // Only safe, customer-visible fields
      recommendation: {
        service: assessment.recommendedService,
        packageChoice: assessment.packageChoice,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[submit-assessment] Unhandled error:', message);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
