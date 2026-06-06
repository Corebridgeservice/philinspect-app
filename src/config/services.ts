// ============================================================
// PHILinspect — Service Type Configuration
// ============================================================

import { ServiceType } from '@/types/assessment';

export interface ServiceConfig {
  id: ServiceType;
  label: string;
  shortLabel: string;
  description: string;
  category: string;
  icon: string;
}

export const SERVICES: Record<ServiceType, ServiceConfig> = {
  pre_purchase: {
    id: 'pre_purchase',
    label: 'Pre-Purchase Inspection',
    shortLabel: 'Pre-Purchase',
    description:
      'A thorough inspection before you buy — so you know exactly what you\'re getting.',
    category: 'Inspection Services',
    icon: '🔍',
  },
  turnover: {
    id: 'turnover',
    label: 'Turnover Inspection',
    shortLabel: 'Turnover',
    description:
      'Inspect your property at handover to document its condition before you accept the keys.',
    category: 'Inspection Services',
    icon: '🏠',
  },
  defect_liability: {
    id: 'defect_liability',
    label: 'Defect Liability Inspection',
    shortLabel: 'Defect Liability',
    description:
      'Identify defects while still under the developer\'s warranty period.',
    category: 'Inspection Services',
    icon: '🛡️',
  },
  post_defect_rectification: {
    id: 'post_defect_rectification',
    label: 'Post Defect Rectification Inspection',
    shortLabel: 'Post Rectification',
    description:
      'Verify that repairs and defect corrections have been properly completed.',
    category: 'Inspection Services',
    icon: '✅',
  },
  quality_defect: {
    id: 'quality_defect',
    label: 'Quality Defect Inspection',
    shortLabel: 'Quality Defect',
    description:
      'Assess defects and quality issues outside the warranty period.',
    category: 'Inspection Services',
    icon: '📋',
  },
  legalassist: {
    id: 'legalassist',
    label: 'LegalAssist Inspection',
    shortLabel: 'LegalAssist',
    description:
      'Technical inspection reports prepared to support legal proceedings and disputes.',
    category: 'LegalAssist',
    icon: '⚖️',
  },
  construction: {
    id: 'construction',
    label: 'Construction Inspection',
    shortLabel: 'Construction',
    description:
      'Stage-by-stage inspection for owner-builders to ensure quality and compliance.',
    category: 'Construction Services',
    icon: '🏗️',
  },
  proaudit: {
    id: 'proaudit',
    label: 'ProAudit',
    shortLabel: 'ProAudit',
    description:
      'Professional audit for contractors, developers, and property managers.',
    category: 'ProAudit',
    icon: '📊',
  },
  partner_referral: {
    id: 'partner_referral',
    label: 'Partner / Referral Program',
    shortLabel: 'Partnership',
    description:
      'Join the PHILinspect referral network for real estate professionals.',
    category: 'Partnership',
    icon: '🤝',
  },
  consultation_call: {
    id: 'consultation_call',
    label: 'Consultation Call',
    shortLabel: 'Consultation',
    description:
      'Speak with a PHILinspect specialist to find the right service for your needs.',
    category: 'Consultation',
    icon: '📞',
  },
};
