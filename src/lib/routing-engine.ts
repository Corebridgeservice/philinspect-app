// ============================================================
// PHILinspect — Service Routing Engine
// ============================================================

import { ROUTING_RULES } from '@/config/routing';
import { UserType, OwnerSituation, ServiceType } from '@/types/assessment';

/**
 * Resolve the recommended service type from user type and optional owner situation.
 */
export function resolveService(
  userType: UserType,
  ownerSituation?: OwnerSituation | null
): ServiceType {
  // Try to match with ownerSituation first
  if (ownerSituation) {
    const match = ROUTING_RULES.find(
      (r) => r.userType === userType && r.ownerSituation === ownerSituation
    );
    if (match) return match.service;
  }

  // Fallback to userType only
  const fallback = ROUTING_RULES.find(
    (r) => r.userType === userType && !r.ownerSituation
  );
  if (fallback) return fallback.service;

  return 'consultation_call';
}

/**
 * Resolve the Zoho CRM deal stage from user type.
 */
export function resolveZohoStage(userType: UserType): string {
  const rule = ROUTING_RULES.find((r) => r.userType === userType && !r.ownerSituation);
  return rule?.zohoStage ?? 'Inspection Services';
}

/**
 * Determine if the user type requires an owner situation question.
 */
export function requiresOwnerSituation(userType: UserType): boolean {
  return userType === 'property_owner';
}
