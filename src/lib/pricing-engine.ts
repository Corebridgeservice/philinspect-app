// ============================================================
// PHILinspect — Internal Pricing Engine
// PRIVATE: Server-side only. Never import in client components.
// ============================================================

import {
  PRICING_RULES,
  ADD_ON_PRICES,
  PACKAGE_DISCOUNTS,
  resolvePricingKey,
} from '@/config/pricing';
import { resolveMobilizationFee } from '@/config/mobilization';
import { AssessmentData, InternalPricingResult } from '@/types/assessment';

/**
 * Calculate the full internal quote from assessment data.
 * distanceKm should be resolved from Google Maps API before calling this.
 */
export function calculateInternalQuote(
  assessment: AssessmentData,
  distanceKm: number | null
): InternalPricingResult {
  const pricingKey = resolvePricingKey(
    assessment.propertyType,
    assessment.recommendedService
  );
  const rule = PRICING_RULES[pricingKey] ?? PRICING_RULES['default'];

  // Base fee
  const baseFee = rule.baseFee;

  // Additional SQM fee
  const floorArea = assessment.floorArea ?? 0;
  const additionalSqm = Math.max(0, floorArea - rule.includedSqm);
  const additionalSqmFee = additionalSqm * rule.additionalSqmRate;

  // Add-ons total
  const addOnsTotal = assessment.selectedAddOns.reduce((sum, addOn) => {
    return sum + (ADD_ON_PRICES[addOn] ?? 0);
  }, 0);

  // Mobilization fee
  let mobilizationFee = 0;
  let customReviewRequired = false;

  if (distanceKm !== null) {
    const mobilization = resolveMobilizationFee(distanceKm);
    mobilizationFee = mobilization.fee;
    customReviewRequired = mobilization.customReviewRequired;
  }

  // Package discount
  const discount = PACKAGE_DISCOUNTS[assessment.packageChoice ?? 'no_thanks'] ?? 0;

  // Estimated total
  const estimatedTotal =
    baseFee + additionalSqmFee + addOnsTotal + mobilizationFee - discount;

  return {
    baseFee,
    additionalSqmFee,
    addOnsTotal,
    mobilizationFee,
    discount,
    estimatedTotal,
    distanceKm,
    customReviewRequired,
  };
}
