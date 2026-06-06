// ============================================================
// PHILinspect — Service Routing Configuration
// ============================================================

import { UserType, OwnerSituation, ServiceType } from '@/types/assessment';

export interface RoutingRule {
  userType: UserType;
  ownerSituation?: OwnerSituation | null;
  service: ServiceType;
  zohoStage: string;
}

/**
 * Routing rules in priority order.
 * For property_owner, ownerSituation determines the service.
 */
export const ROUTING_RULES: RoutingRule[] = [
  // Property Buyer
  {
    userType: 'property_buyer',
    service: 'pre_purchase',
    zohoStage: 'Inspection Services',
  },

  // Property Owner — by situation
  {
    userType: 'property_owner',
    ownerSituation: 'near_turnover',
    service: 'turnover',
    zohoStage: 'Inspection Services',
  },
  {
    userType: 'property_owner',
    ownerSituation: 'defects_under_warranty',
    service: 'defect_liability',
    zohoStage: 'Inspection Services',
  },
  {
    userType: 'property_owner',
    ownerSituation: 'repairs_completed',
    service: 'post_defect_rectification',
    zohoStage: 'Inspection Services',
  },
  {
    userType: 'property_owner',
    ownerSituation: 'defects_outside_warranty',
    service: 'quality_defect',
    zohoStage: 'Inspection Services',
  },
  {
    userType: 'property_owner',
    ownerSituation: 'legal_action',
    service: 'legalassist',
    zohoStage: 'LegalAssist',
  },

  // Owner-Builder
  {
    userType: 'owner_builder',
    service: 'construction',
    zohoStage: 'Construction Services',
  },

  // Contractor / Builder
  {
    userType: 'contractor_builder',
    service: 'proaudit',
    zohoStage: 'ProAudit',
  },

  // Developer / Property Manager
  {
    userType: 'developer_pm',
    service: 'proaudit',
    zohoStage: 'ProAudit',
  },

  // Real Estate Agent / Broker
  {
    userType: 'real_estate_agent',
    service: 'partner_referral',
    zohoStage: 'Partnership',
  },

  // Lawyer / Legal Representative
  {
    userType: 'lawyer',
    service: 'legalassist',
    zohoStage: 'LegalAssist',
  },

  // Other
  {
    userType: 'other',
    service: 'consultation_call',
    zohoStage: 'Consultation',
  },
];

export const USER_TYPE_LABELS: Record<UserType, string> = {
  property_buyer: 'Property Buyer',
  property_owner: 'Property Owner',
  owner_builder: 'Owner-Builder',
  contractor_builder: 'Contractor / Builder',
  developer_pm: 'Developer / Property Manager',
  real_estate_agent: 'Real Estate Agent / Broker',
  lawyer: 'Lawyer / Legal Representative',
  other: 'Other',
};

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house_and_lot: 'House and Lot',
  condo: 'Condo',
  townhouse: 'Townhouse',
  row_house: 'Row House',
  commercial: 'Commercial Property',
  lot_land: 'Lot / Land',
  not_sure: 'Not Sure',
};

export const OWNER_SITUATION_LABELS: Partial<Record<OwnerSituation, string>> = {
  near_turnover: 'My property is near turnover / just turned over',
  defects_under_warranty: 'I have defects still under warranty',
  repairs_completed: 'Repairs were completed — I want to verify',
  defects_outside_warranty: 'I have defects outside the warranty period',
  legal_action: 'I am pursuing legal action',
};
