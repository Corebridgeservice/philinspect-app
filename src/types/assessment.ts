// ============================================================
// PHILinspect — Shared Assessment Types
// ============================================================

export type UserType =
  | 'property_buyer'
  | 'property_owner'
  | 'owner_builder'
  | 'contractor_builder'
  | 'developer_pm'
  | 'real_estate_agent'
  | 'lawyer'
  | 'other';

export type PropertyType =
  | 'house_and_lot'
  | 'condo'
  | 'townhouse'
  | 'row_house'
  | 'commercial'
  | 'lot_land'
  | 'not_sure';

// Property Buyer sub-type
export type BuyerPropertySubType =
  | 'brand_new'
  | 'resale'
  | 'foreclosed'
  | 'not_sure';

// Property Owner situations — comprehensive list covering all scenarios
export type OwnerSituation =
  | 'near_turnover'
  | 'defects_under_warranty'
  | 'repairs_completed'
  | 'defects_outside_warranty'
  | 'construction_about_to_start'
  | 'construction_ongoing'
  | 'construction_almost_complete'
  | 'construction_completed'
  | 'renovation_ongoing'
  | 'renovation_completed'
  | 'progress_billing_validation'
  | 'accomplishment_report'
  | 'buying_property'
  | 'legal_action'
  | 'not_sure';

// Who completed repairs
export type RepairCompletedBy =
  | 'developer'
  | 'contractor'
  | 'renovation_contractor'
  | 'insurance_provider'
  | 'other';

// Owner-Builder construction status
export type ConstructionStatus =
  | 'about_to_start'
  | 'ongoing'
  | 'almost_complete'
  | 'completed'
  | 'progress_billing'
  | 'accomplishment_report';

// ProAudit service type
export type ProAuditService =
  | 'quality_audit'
  | 'progress_billing'
  | 'accomplishment_report'
  | 'defect_documentation'
  | 'third_party_qa'
  | 'third_party_report'
  | 'punchlisting'
  | 'turnover_readiness'
  | 'bulk_unit'
  | 'common_area'
  | 'construction_monitoring'
  | 'not_sure';

// Partner flow option
export type PartnerOption =
  | 'inspection_for_client'
  | 'become_partner'
  | 'partnership_presentation'
  | 'refer_client'
  | 'book_call';

// LegalAssist support type
export type LegalAssistOption =
  | 'defect_documentation'
  | 'repair_cost_estimate'
  | 'accomplishment_report'
  | 'expert_inspection_report'
  | 'court_mediation'
  | 'construction_dispute';

export type ServiceType =
  | 'pre_purchase'
  | 'turnover'
  | 'defect_liability'
  | 'post_defect_rectification'
  | 'quality_defect'
  | 'legalassist'
  | 'construction'
  | 'proaudit'
  | 'partner_referral'
  | 'consultation_call';

export type PackageChoice =
  | 'recommended'
  | 'build_own'
  | 'no_thanks'
  | 'recommend_by_concern';

export type AddOn = 'proestimate' | 'scopecheck' | 'expert_statement';

export type SpecializedPackage =
  | 'condo_essential'
  | 'condo_premium'
  | 'condo_custom'
  | 'essential'
  | 'premium'
  | 'ultimate'
  | 'construction_essential'
  | 'construction_plus'
  | 'construction_premium'
  | 'construction_ultimate';

export interface AssessmentData {
  userType: UserType | null;
  propertyType: PropertyType | null;
  buyerPropertySubType: BuyerPropertySubType | null;
  ownerSituation: OwnerSituation | null;
  repairCompletedBy: RepairCompletedBy | null;
  wantReinspection: boolean | null;
  constructionStatus: ConstructionStatus | null;
  proAuditService: ProAuditService | null;
  partnerOption: PartnerOption | null;
  legalAssistOption: LegalAssistOption | null;
  recommendedService: ServiceType | null;
  packageChoice: PackageChoice | null;
  specializedPackage: SpecializedPackage | null;
  selectedAddOns: AddOn[];
  propertyAddress: string;
  propertyAddressPlaceId: string;
  floorArea: number | null;
  numberOfFloors: number | null;
  furnished: boolean | null;
  occupied: boolean | null;
  preferredInspectionDate: string;
  fullName: string;
  mobile: string;
  email: string;
  viber: string;
  whatsapp: string;
  preferredCallDate: string;
  preferredCallTime: string;
  hearAboutUs: string;
  bestContactMethod: string;
}

export interface InternalPricingResult {
  baseFee: number;
  additionalSqmFee: number;
  addOnsTotal: number;
  mobilizationFee: number;
  discount: number;
  estimatedTotal: number;
  distanceKm: number | null;
  customReviewRequired: boolean;
}

export interface SubmissionPayload {
  assessment: AssessmentData;
  pricing: InternalPricingResult;
  timestamp: string;
}
