// ============================================================
// PHILinspect — Internal Pricing Configuration
// PRIVATE: Never expose these values to the client/browser.
// ============================================================

import { PropertyType, ServiceType } from '@/types/assessment';

export interface PricingRule {
  baseFee: number;
  includedSqm: number;
  additionalSqmRate: number;
}

/**
 * Base pricing per property/service type.
 * All amounts are in Philippine Peso (₱).
 */
export const PRICING_RULES: Record<string, PricingRule> = {
  condo: {
    baseFee: 13_999,
    includedSqm: 50,
    additionalSqmRate: 75,
  },
  house_and_lot: {
    baseFee: 17_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  townhouse: {
    baseFee: 17_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  row_house: {
    baseFee: 17_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  commercial: {
    baseFee: 17_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  construction: {
    baseFee: 24_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  legalassist: {
    baseFee: 30_000,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
  // Fallback for lot_land, not_sure, consultation_call, partner_referral
  default: {
    baseFee: 17_999,
    includedSqm: 100,
    additionalSqmRate: 100,
  },
};

/**
 * Resolve the pricing rule key from property type and service type.
 */
export function resolvePricingKey(
  propertyType: PropertyType | null,
  serviceType: ServiceType | null
): string {
  if (serviceType === 'legalassist') return 'legalassist';
  if (serviceType === 'construction' || serviceType === 'proaudit') return 'construction';
  if (propertyType === 'condo') return 'condo';
  if (propertyType === 'house_and_lot') return 'house_and_lot';
  if (propertyType === 'townhouse') return 'townhouse';
  if (propertyType === 'row_house') return 'row_house';
  if (propertyType === 'commercial') return 'commercial';
  return 'default';
}

// ---- Add-on pricing ----
export const ADD_ON_PRICES: Record<string, number> = {
  proestimate: 12_500,
  scopecheck: 12_500,
  expert_statement: 12_500,
};

// ---- Package discounts ----
export const PACKAGE_DISCOUNTS: Record<string, number> = {
  recommended: 0,
  build_own: 0,
  no_thanks: 0,
  recommend_by_concern: 0,
};
