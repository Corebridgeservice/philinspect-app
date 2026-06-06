// ============================================================
// PHILinspect — Zoho CRM Integration (Server-side)
// PRIVATE: All pricing data is internal only.
// ============================================================

import axios from 'axios';
import { AssessmentData, InternalPricingResult } from '@/types/assessment';
import { USER_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/config/routing';
import { SERVICES } from '@/config/services';
import { ADD_ONS } from '@/config/packages';
import { resolveZohoStage } from '@/lib/routing-engine';

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID ?? '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET ?? '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN ?? '';
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL ?? 'https://accounts.zoho.com';
const ZOHO_API_BASE_URL = process.env.ZOHO_API_BASE_URL ?? 'https://www.zohoapis.com';

export interface ZohoCRMResult {
  success: boolean;
  leadId?: string;
  dealId?: string;
  error?: string;
}

/**
 * Obtain a fresh Zoho CRM access token using the refresh token.
 */
async function getZohoAccessToken(): Promise<string> {
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
    throw new Error('Failed to obtain Zoho access token: ' + JSON.stringify(response.data));
  }

  return response.data.access_token;
}

/**
 * Create a Lead in Zoho CRM with full assessment and pricing details.
 */
export async function createZohoLead(
  assessment: AssessmentData,
  pricing: InternalPricingResult
): Promise<ZohoCRMResult> {
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    console.warn('[zoho-crm] Not fully configured — skipping Lead creation.');
    return { success: false, error: 'Zoho CRM not configured' };
  }

  try {
    const accessToken = await getZohoAccessToken();

    const addOnsLabel = assessment.selectedAddOns
      .map((a) => ADD_ONS[a]?.label ?? a)
      .join(', ') || 'None';

    const nameParts = assessment.fullName.trim().split(' ');
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const leadData = {
      data: [
        {
          Lead_Source: 'PHILinspect Assessment',
          First_Name: firstName,
          Last_Name: lastName,
          Full_Name: assessment.fullName,
          Phone: assessment.mobile,
          Email: assessment.email,
          // Custom fields — must be created in Zoho CRM first
          Viber: assessment.viber || '',
          WhatsApp: assessment.whatsapp || '',
          User_Type: USER_TYPE_LABELS[assessment.userType!] ?? assessment.userType ?? '',
          Property_Type: PROPERTY_TYPE_LABELS[assessment.propertyType!] ?? assessment.propertyType ?? '',
          Service_Type: SERVICES[assessment.recommendedService!]?.label ?? assessment.recommendedService ?? '',
          Package_Choice: assessment.packageChoice ?? '',
          Add_Ons: addOnsLabel,
          Property_Address: assessment.propertyAddress,
          Floor_Area_sqm: assessment.floorArea?.toString() ?? '',
          Number_of_Floors: assessment.numberOfFloors?.toString() ?? '',
          Distance_KM: pricing.distanceKm?.toString() ?? 'N/A',
          Mobilization_Fee: pricing.mobilizationFee.toString(),
          Estimated_Internal_Quote: pricing.estimatedTotal.toString(),
          Preferred_Inspection_Date: assessment.preferredInspectionDate || '',
          Preferred_Call_Date: assessment.preferredCallDate || '',
          Preferred_Call_Time: assessment.preferredCallTime || '',
          Custom_Review_Required: pricing.customReviewRequired ? 'Yes' : 'No',
          Description: `PHILinspect Assessment Submission\nService: ${SERVICES[assessment.recommendedService!]?.label}\nProperty: ${assessment.propertyAddress}\nFloor Area: ${assessment.floorArea} sqm`,
        },
      ],
    };

    const leadResponse = await axios.post(
      `${ZOHO_API_BASE_URL}/crm/v6/Leads`,
      leadData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const leadId = leadResponse.data?.data?.[0]?.details?.id;

    return { success: true, leadId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[zoho-crm] Lead creation failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Create a Deal in Zoho CRM (optional — linked to Lead).
 */
export async function createZohoDeal(
  assessment: AssessmentData,
  pricing: InternalPricingResult,
  leadId?: string
): Promise<ZohoCRMResult> {
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    return { success: false, error: 'Zoho CRM not configured' };
  }

  try {
    const accessToken = await getZohoAccessToken();
    const stage = resolveZohoStage(assessment.userType!);

    const dealData = {
      data: [
        {
          Deal_Name: `${assessment.fullName} — ${SERVICES[assessment.recommendedService!]?.shortLabel ?? 'Inspection'}`,
          Stage: 'Qualification',
          Pipeline: stage,
          Amount: pricing.estimatedTotal,
          Phone: assessment.mobile,
          Email: assessment.email,
          Property_Address: assessment.propertyAddress,
          Service_Type: SERVICES[assessment.recommendedService!]?.label ?? '',
          Lead_Source: 'PHILinspect Assessment',
          Description: `Internal Quote: ₱${pricing.estimatedTotal.toLocaleString()}\nDistance: ${pricing.distanceKm ?? 'N/A'} km\nMobilization: ₱${pricing.mobilizationFee.toLocaleString()}`,
          ...(leadId ? { Lead_Id: leadId } : {}),
        },
      ],
    };

    const dealResponse = await axios.post(
      `${ZOHO_API_BASE_URL}/crm/v6/Deals`,
      dealData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const dealId = dealResponse.data?.data?.[0]?.details?.id;
    return { success: true, dealId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[zoho-crm] Deal creation failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Check if Zoho CRM is configured.
 */
export function isZohoCRMConfigured(): boolean {
  return Boolean(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN);
}
