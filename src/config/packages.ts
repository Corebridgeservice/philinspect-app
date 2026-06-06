// ============================================================
// PHILinspect — Add-On Packages Configuration
// NOTE: Prices are backend-only and must NOT be shown to users.
// ============================================================

import { AddOn } from '@/types/assessment';

export interface AddOnConfig {
  id: AddOn;
  label: string;
  description: string;
  icon: string;
  // availableFor: which service types support this add-on
  availableFor: string[];
}

export const ADD_ONS: Record<AddOn, AddOnConfig> = {
  proestimate: {
    id: 'proestimate',
    label: 'ProEstimate',
    description:
      'Detailed cost estimate for repairs and rectification works based on inspection findings.',
    icon: '💰',
    availableFor: [
      'pre_purchase',
      'turnover',
      'defect_liability',
      'post_defect_rectification',
      'quality_defect',
      'construction',
    ],
  },
  scopecheck: {
    id: 'scopecheck',
    label: 'ScopeCheck',
    description:
      'Review of scope of works, BOQ, or construction plans for accuracy and completeness.',
    icon: '📐',
    availableFor: [
      'construction',
      'proaudit',
      'pre_purchase',
      'turnover',
    ],
  },
  expert_statement: {
    id: 'expert_statement',
    label: 'Expert Statement',
    description:
      'Formal expert witness statement prepared for legal proceedings or dispute resolution.',
    icon: '📜',
    availableFor: ['legalassist', 'quality_defect', 'defect_liability'],
  },
};

// Add-ons excluded for Condo property type
export const CONDO_EXCLUDED_ADDONS: AddOn[] = [];

// Add-ons available for Condo
export const CONDO_ALLOWED_ADDONS: AddOn[] = [
  'proestimate',
  'scopecheck',
  'expert_statement',
];

// Specialized inspection options excluded for Condo
export const CONDO_EXCLUDED_INSPECTIONS = [
  'Drone Roof Inspection',
  'Septic Tank Inspection',
  'Pool / Spa Inspection',
];

export const CONDO_ALLOWED_INSPECTIONS = [
  'Infrared Scan',
  'Pest Inspection',
  'Mold Assessment',
];
