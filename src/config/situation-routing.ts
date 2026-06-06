// ============================================================
// PHILinspect — Complete Situation Routing Matrix
// Maps every property type × situation to the correct service.
// ============================================================

import { PropertyType, ServiceType } from '@/types/assessment';

export type OwnerSituation =
  // Turnover / Handover
  | 'near_turnover'
  // Defects
  | 'defects_under_warranty'
  | 'defects_outside_warranty'
  // Repairs
  | 'repairs_completed'
  // Construction / Renovation
  | 'construction_about_to_start'
  | 'construction_ongoing'
  | 'construction_almost_complete'
  | 'construction_completed'
  | 'renovation_ongoing'
  | 'renovation_completed'
  // Progress / Billing
  | 'progress_billing_validation'
  | 'accomplishment_report'
  // Buying
  | 'buying_property'
  // Legal
  | 'legal_action'
  // Other
  | 'not_sure';

export interface SituationConfig {
  id: OwnerSituation;
  icon: string;
  label: string;
  description: string;
  service: ServiceType;
  // Which property types this situation applies to (empty = all)
  applicablePropertyTypes: PropertyType[];
  // Which property types this situation does NOT apply to
  excludedPropertyTypes: PropertyType[];
  // Does this situation trigger the reinspection question?
  askReinspection: boolean;
  // Does this situation trigger the repair-completed-by question?
  askRepairCompletedBy: boolean;
  // Does this situation trigger the construction status question?
  askConstructionStatus: boolean;
}

export const OWNER_SITUATIONS: SituationConfig[] = [
  // ---- Turnover ----
  {
    id: 'near_turnover',
    icon: '🔑',
    label: 'Near Turnover / Just Turned Over',
    description: 'My property is near turnover or was just handed over to me',
    service: 'turnover',
    applicablePropertyTypes: [],
    excludedPropertyTypes: ['lot_land'],
    askReinspection: true,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Defects Under Warranty ----
  {
    id: 'defects_under_warranty',
    icon: '🛡️',
    label: 'Defects Under Warranty',
    description: "I have defects and the developer's warranty hasn't expired yet",
    service: 'defect_liability',
    applicablePropertyTypes: [],
    excludedPropertyTypes: ['lot_land'],
    askReinspection: true,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Repairs Completed ----
  {
    id: 'repairs_completed',
    icon: '✅',
    label: 'Repairs Already Completed',
    description: 'Repairs were done — I want to verify the work was properly completed',
    service: 'post_defect_rectification',
    applicablePropertyTypes: [],
    excludedPropertyTypes: ['lot_land'],
    askReinspection: false,
    askRepairCompletedBy: true,
    askConstructionStatus: false,
  },

  // ---- Defects Outside Warranty ----
  {
    id: 'defects_outside_warranty',
    icon: '📋',
    label: 'Defects Outside Warranty',
    description: 'I have defects but the warranty period has already expired',
    service: 'quality_defect',
    applicablePropertyTypes: [],
    excludedPropertyTypes: ['lot_land'],
    askReinspection: true,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Construction: About to Start ----
  {
    id: 'construction_about_to_start',
    icon: '📐',
    label: 'Construction is About to Start',
    description: 'My property construction is about to begin — I want stage inspections',
    service: 'construction',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: true,
  },

  // ---- Construction: Ongoing ----
  {
    id: 'construction_ongoing',
    icon: '🏗️',
    label: 'Construction is Ongoing',
    description: 'My property is currently under construction',
    service: 'construction',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: true,
  },

  // ---- Construction: Almost Complete ----
  {
    id: 'construction_almost_complete',
    icon: '🔨',
    label: 'Construction is Almost Complete',
    description: 'Construction is nearing completion — I need punchlisting or pre-turnover inspection',
    service: 'construction',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: true,
  },

  // ---- Construction: Completed ----
  {
    id: 'construction_completed',
    icon: '🏠',
    label: 'Construction is Completed',
    description: 'Construction is done — I want a final inspection and documentation',
    service: 'construction',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: true,
  },

  // ---- Renovation: Ongoing ----
  {
    id: 'renovation_ongoing',
    icon: '🔧',
    label: 'Renovation is Ongoing',
    description: 'My property is currently being renovated — I want to monitor quality',
    service: 'construction',
    applicablePropertyTypes: [],
    excludedPropertyTypes: [],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Renovation: Completed ----
  {
    id: 'renovation_completed',
    icon: '🏡',
    label: 'Renovation is Completed',
    description: 'Renovation is done — I want to verify the quality of work',
    service: 'post_defect_rectification',
    applicablePropertyTypes: [],
    excludedPropertyTypes: [],
    askReinspection: false,
    askRepairCompletedBy: true,
    askConstructionStatus: false,
  },

  // ---- Progress Billing ----
  {
    id: 'progress_billing_validation',
    icon: '💰',
    label: 'Progress Billing Validation',
    description: 'I want to verify that contractor billing matches actual construction progress',
    service: 'proaudit',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Accomplishment Report ----
  {
    id: 'accomplishment_report',
    icon: '📊',
    label: 'Percentage of Accomplishment Report',
    description: 'I need an independent report on the percentage of construction completed',
    service: 'proaudit',
    applicablePropertyTypes: ['house_and_lot', 'townhouse', 'row_house', 'commercial', 'lot_land'],
    excludedPropertyTypes: ['condo'],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Buying a Property ----
  {
    id: 'buying_property',
    icon: '🏠',
    label: 'Buying Another Property',
    description: "I'm a property owner looking to buy another property",
    service: 'pre_purchase',
    applicablePropertyTypes: [],
    excludedPropertyTypes: [],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Legal Action ----
  {
    id: 'legal_action',
    icon: '⚖️',
    label: 'Legal Action / Dispute',
    description: 'I am pursuing or considering legal action and need a technical report',
    service: 'legalassist',
    applicablePropertyTypes: [],
    excludedPropertyTypes: [],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },

  // ---- Not Sure ----
  {
    id: 'not_sure',
    icon: '💬',
    label: "I'm Not Sure",
    description: "I'm not sure which situation applies — PHILinspect will help",
    service: 'consultation_call',
    applicablePropertyTypes: [],
    excludedPropertyTypes: [],
    askReinspection: false,
    askRepairCompletedBy: false,
    askConstructionStatus: false,
  },
];

/**
 * Get applicable situations for a given property type.
 * Filters out situations not applicable to the property type.
 */
export function getSituationsForPropertyType(propertyType: PropertyType | null): SituationConfig[] {
  if (!propertyType) return OWNER_SITUATIONS;

  return OWNER_SITUATIONS.filter((s) => {
    // If excluded, hide it
    if (s.excludedPropertyTypes.includes(propertyType)) return false;
    // If applicablePropertyTypes is set, only show for those types
    if (s.applicablePropertyTypes.length > 0 && !s.applicablePropertyTypes.includes(propertyType)) return false;
    return true;
  });
}

/**
 * Get the service for a given situation.
 */
export function getServiceForSituation(situationId: OwnerSituation): ServiceType {
  const situation = OWNER_SITUATIONS.find((s) => s.id === situationId);
  return situation?.service ?? 'consultation_call';
}
