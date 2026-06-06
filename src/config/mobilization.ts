// ============================================================
// PHILinspect — Mobilization Fee Configuration
// PRIVATE: Never expose these values to the client/browser.
// ============================================================

export interface MobilizationTier {
  maxKm: number | null; // null = above threshold → custom review
  fee: number;
  label: string;
}

/**
 * Tiers are evaluated in order.
 * If distance exceeds the last defined tier, customReviewRequired = true.
 */
export const MOBILIZATION_TIERS: MobilizationTier[] = [
  { maxKm: 15, fee: 6_000, label: 'Metro Manila / 0–15 km' },
  { maxKm: 30, fee: 6_500, label: '16–30 km' },
  { maxKm: 45, fee: 7_000, label: '31–45 km' },
  { maxKm: 60, fee: 7_500, label: '46–60 km' },
  { maxKm: null, fee: 0, label: 'Above 60 km — Custom Review Required' },
];

export const METRO_MANILA_FLAT_FEE = 6_000;

/**
 * Resolve mobilization fee from distance in km.
 * Returns { fee, customReviewRequired }.
 */
export function resolveMobilizationFee(distanceKm: number): {
  fee: number;
  customReviewRequired: boolean;
} {
  for (const tier of MOBILIZATION_TIERS) {
    if (tier.maxKm === null) {
      return { fee: 0, customReviewRequired: true };
    }
    if (distanceKm <= tier.maxKm) {
      return { fee: tier.fee, customReviewRequired: false };
    }
  }
  return { fee: 0, customReviewRequired: true };
}
