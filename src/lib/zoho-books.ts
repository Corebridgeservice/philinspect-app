// ============================================================
// PHILinspect — Zoho Books Integration (Server-side)
// PRIVATE: Feature-flagged via ENABLE_ZOHO_BOOKS env var.
// ============================================================

import axios from 'axios';
import { AssessmentData, InternalPricingResult } from '@/types/assessment';
import { SERVICES } from '@/config/services';
import { ADD_ONS } from '@/config/packages';
import { ADD_ON_PRICES as ADD_ON_PRICE_MAP } from '@/config/pricing';

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID ?? '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET ?? '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN ?? '';
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL ?? 'https://accounts.zoho.com';
const ZOHO_API_BASE_URL = process.env.ZOHO_API_BASE_URL ?? 'https://www.zohoapis.com';
const ZOHO_BOOKS_ORG_ID = process.env.ZOHO_BOOKS_ORG_ID ?? '';
const ENABLE_ZOHO_BOOKS = process.env.ENABLE_ZOHO_BOOKS === 'true';

export interface ZohoBooksResult {
  success: boolean;
  contactId?: string;
  estimateId?: string;
  error?: string;
}

async function getZohoBooksAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  const response = await axios.post(
    `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  if (!response.data.access_token) {
    throw new Error('Failed to obtain Zoho Books access token');
  }

  return response.data.access_token;
}

/**
 * Create a Contact in Zoho Books.
 */
export async function createZohoBooksContact(
  assessment: AssessmentData
): Promise<ZohoBooksResult> {
  if (!ENABLE_ZOHO_BOOKS) {
    return { success: false, error: 'Zoho Books is disabled (ENABLE_ZOHO_BOOKS=false)' };
  }

  if (!ZOHO_BOOKS_ORG_ID || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    return { success: false, error: 'Zoho Books not fully configured' };
  }

  try {
    const accessToken = await getZohoBooksAccessToken();

    const contactData = {
      contact_name: assessment.fullName,
      contact_type: 'customer',
      email: assessment.email,
      phone: assessment.mobile,
      billing_address: {
        address: assessment.propertyAddress,
      },
      notes: `PHILinspect Assessment Lead\nViber: ${assessment.viber}\nWhatsApp: ${assessment.whatsapp}`,
    };

    const response = await axios.post(
      `${ZOHO_API_BASE_URL}/books/v3/contacts?organization_id=${ZOHO_BOOKS_ORG_ID}`,
      contactData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const contactId = response.data?.contact?.contact_id;
    return { success: true, contactId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[zoho-books] Contact creation failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Create an Estimate in Zoho Books (estimate-ready payload).
 * This is the internal quotation — never shown to the customer.
 */
export async function createZohoBooksEstimate(
  assessment: AssessmentData,
  pricing: InternalPricingResult,
  contactId: string
): Promise<ZohoBooksResult> {
  if (!ENABLE_ZOHO_BOOKS) {
    return { success: false, error: 'Zoho Books is disabled (ENABLE_ZOHO_BOOKS=false)' };
  }

  if (!ZOHO_BOOKS_ORG_ID || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    return { success: false, error: 'Zoho Books not fully configured' };
  }

  try {
    const accessToken = await getZohoBooksAccessToken();
    const serviceLabel = SERVICES[assessment.recommendedService!]?.label ?? 'Inspection Service';

    // Build line items
    const lineItems: object[] = [
      {
        name: serviceLabel,
        description: `Property: ${assessment.propertyAddress}\nFloor Area: ${assessment.floorArea} sqm`,
        rate: pricing.baseFee,
        quantity: 1,
      },
    ];

    if (pricing.additionalSqmFee > 0) {
      lineItems.push({
        name: 'Additional SQM Fee',
        description: `Above included area`,
        rate: pricing.additionalSqmFee,
        quantity: 1,
      });
    }

    if (pricing.mobilizationFee > 0) {
      lineItems.push({
        name: 'Mobilization Fee',
        description: `Distance: ${pricing.distanceKm} km`,
        rate: pricing.mobilizationFee,
        quantity: 1,
      });
    }

    for (const addOn of assessment.selectedAddOns) {
      lineItems.push({
        name: ADD_ONS[addOn]?.label ?? addOn,
        description: ADD_ONS[addOn]?.description ?? '',
        rate: ADD_ON_PRICE_MAP[addOn] ?? 0,
        quantity: 1,
      });
    }

    const estimateData = {
      customer_id: contactId,
      reference_number: `PHI-${Date.now()}`,
      line_items: lineItems,
      notes: `Internal PHILinspect Estimate\nDo not share with customer.\nPreferred Call: ${assessment.preferredCallDate} ${assessment.preferredCallTime}`,
      terms: 'This estimate is for internal review only.',
    };

    const response = await axios.post(
      `${ZOHO_API_BASE_URL}/books/v3/estimates?organization_id=${ZOHO_BOOKS_ORG_ID}`,
      estimateData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const estimateId = response.data?.estimate?.estimate_id;
    return { success: true, estimateId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[zoho-books] Estimate creation failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Check if Zoho Books is enabled and configured.
 */
export function isZohoBooksConfigured(): boolean {
  return ENABLE_ZOHO_BOOKS && Boolean(ZOHO_BOOKS_ORG_ID && ZOHO_CLIENT_ID && ZOHO_REFRESH_TOKEN);
}
