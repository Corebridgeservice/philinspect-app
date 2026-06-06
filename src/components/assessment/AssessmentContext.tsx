'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  AssessmentData, UserType, PropertyType, BuyerPropertySubType,
  OwnerSituation, RepairCompletedBy, ConstructionStatus, ProAuditService,
  PartnerOption, LegalAssistOption, ServiceType, PackageChoice, AddOn,
  SpecializedPackage
} from '@/types/assessment';
import { getServiceForSituation, OWNER_SITUATIONS } from '@/config/situation-routing';

const defaultAssessment: AssessmentData = {
  userType: null,
  propertyType: null,
  buyerPropertySubType: null,
  ownerSituation: null,
  repairCompletedBy: null,
  wantReinspection: null,
  constructionStatus: null,
  proAuditService: null,
  partnerOption: null,
  legalAssistOption: null,
  recommendedService: null,
  packageChoice: null,
  specializedPackage: null,
  selectedAddOns: [],
  propertyAddress: '',
  propertyAddressPlaceId: '',
  floorArea: null,
  numberOfFloors: null,
  furnished: null,
  occupied: null,
  preferredInspectionDate: '',
  fullName: '',
  mobile: '',
  email: '',
  viber: '',
  whatsapp: '',
  preferredCallDate: '',
  preferredCallTime: '',
  hearAboutUs: '',
  bestContactMethod: '',
};

export type Step =
  | 'welcome'
  | 'user_type'
  | 'property_type'
  | 'buyer_property_subtype'
  | 'owner_situation'
  | 'repair_completed_by'
  | 'want_reinspection'
  | 'construction_status'
  | 'proaudit_service'
  | 'partner_option'
  | 'legalassist_option'
  | 'service_recommendation'
  | 'package_choice'
  | 'property_details'
  | 'contact_details'
  | 'confirmation';

const HOUSE_TYPES: PropertyType[] = ['house_and_lot', 'townhouse', 'row_house', 'commercial'];
const CONDO_TYPES: PropertyType[] = ['condo'];
const SKIP_PACKAGE_TYPES: PropertyType[] = ['lot_land', 'not_sure'];

function resolveServiceFromUserType(userType: UserType): ServiceType {
  switch (userType) {
    case 'property_buyer': return 'pre_purchase';
    case 'owner_builder': return 'construction';
    case 'contractor_builder': return 'proaudit';
    case 'developer_pm': return 'proaudit';
    case 'real_estate_agent': return 'partner_referral';
    case 'lawyer': return 'legalassist';
    case 'other': return 'consultation_call';
    default: return 'consultation_call';
  }
}

function getSituationConfig(situationId: OwnerSituation | null) {
  if (!situationId) return null;
  return OWNER_SITUATIONS.find(s => s.id === situationId) ?? null;
}

function buildStepSequence(a: AssessmentData): Step[] {
  const steps: Step[] = ['welcome', 'user_type', 'property_type'];
  const ut = a.userType;
  const pt = a.propertyType;
  const sit = a.ownerSituation;
  const sitConfig = getSituationConfig(sit);

  if (ut === 'property_buyer') {
    steps.push('buyer_property_subtype');
  } else if (ut === 'property_owner') {
    steps.push('owner_situation');
    if (sitConfig?.askRepairCompletedBy) steps.push('repair_completed_by');
    if (sitConfig?.askReinspection) steps.push('want_reinspection');
    if (sitConfig?.askConstructionStatus) steps.push('construction_status');
  } else if (ut === 'owner_builder') {
    steps.push('construction_status');
  } else if (ut === 'contractor_builder' || ut === 'developer_pm') {
    steps.push('proaudit_service');
  } else if (ut === 'real_estate_agent') {
    steps.push('partner_option');
  } else if (ut === 'lawyer') {
    steps.push('legalassist_option');
  }

  // Service recommendation — skip for partner/other/consultation
  const service = a.recommendedService;
  const skipRecommendation = service === 'partner_referral' || (ut === 'other');
  if (!skipRecommendation) {
    steps.push('service_recommendation');
  }

  // Package choice — skip for lot/land, not_sure property types, partner, other
  const skipPackage =
    (pt && SKIP_PACKAGE_TYPES.includes(pt)) ||
    ut === 'real_estate_agent' ||
    ut === 'other' ||
    service === 'consultation_call';

  if (!skipPackage) {
    steps.push('package_choice');
  }

  steps.push('property_details');
  steps.push('contact_details');
  steps.push('confirmation');

  return steps;
}

interface AssessmentContextValue {
  assessment: AssessmentData;
  currentStep: Step;
  stepIndex: number;
  totalSteps: number;
  progressPercent: number;
  isSubmitting: boolean;
  submitError: string | null;
  isCondo: boolean;
  isHouseType: boolean;
  isSkipPackageType: boolean;
  setUserType: (v: UserType) => void;
  setPropertyType: (v: PropertyType) => void;
  setBuyerPropertySubType: (v: BuyerPropertySubType) => void;
  setOwnerSituation: (v: OwnerSituation) => void;
  setRepairCompletedBy: (v: RepairCompletedBy) => void;
  setWantReinspection: (v: boolean) => void;
  setConstructionStatus: (v: ConstructionStatus) => void;
  setProAuditService: (v: ProAuditService) => void;
  setPartnerOption: (v: PartnerOption) => void;
  setLegalAssistOption: (v: LegalAssistOption) => void;
  setPackageChoice: (v: PackageChoice) => void;
  setSpecializedPackage: (v: SpecializedPackage) => void;
  toggleAddOn: (v: AddOn) => void;
  setPropertyDetails: (v: Partial<AssessmentData>) => void;
  setContactDetails: (v: Partial<AssessmentData>) => void;
  goNext: () => void;
  goBack: () => void;
  submitAssessment: () => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [assessment, setAssessment] = useState<AssessmentData>(defaultAssessment);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = buildStepSequence(assessment);
  const progressSteps = steps.filter(s => s !== 'welcome' && s !== 'confirmation');
  const progressIndex = progressSteps.indexOf(currentStep);
  const totalSteps = progressSteps.length;
  const progressPercent = progressIndex < 0 ? 0 : Math.round(((progressIndex + 1) / totalSteps) * 100);
  const stepIndex = steps.indexOf(currentStep);

  const isCondo = assessment.propertyType === 'condo';
  const isHouseType = HOUSE_TYPES.includes(assessment.propertyType ?? '' as PropertyType);
  const isSkipPackageType = SKIP_PACKAGE_TYPES.includes(assessment.propertyType ?? '' as PropertyType);

  const setUserType = useCallback((v: UserType) => {
    setAssessment(prev => ({
      ...prev,
      userType: v,
      ownerSituation: null,
      buyerPropertySubType: null,
      constructionStatus: null,
      proAuditService: null,
      partnerOption: null,
      legalAssistOption: null,
      recommendedService: resolveServiceFromUserType(v),
    }));
  }, []);

  const setPropertyType = useCallback((v: PropertyType) => {
    setAssessment(prev => ({ ...prev, propertyType: v }));
  }, []);

  const setBuyerPropertySubType = useCallback((v: BuyerPropertySubType) => {
    setAssessment(prev => ({ ...prev, buyerPropertySubType: v, recommendedService: 'pre_purchase' }));
  }, []);

  const setOwnerSituation = useCallback((v: OwnerSituation) => {
    const service = getServiceForSituation(v);
    setAssessment(prev => ({
      ...prev,
      ownerSituation: v,
      repairCompletedBy: null,
      wantReinspection: null,
      recommendedService: service,
    }));
  }, []);

  const setRepairCompletedBy = useCallback((v: RepairCompletedBy) => {
    setAssessment(prev => ({ ...prev, repairCompletedBy: v }));
  }, []);

  const setWantReinspection = useCallback((v: boolean) => {
    setAssessment(prev => ({ ...prev, wantReinspection: v }));
  }, []);

  const setConstructionStatus = useCallback((v: ConstructionStatus) => {
    setAssessment(prev => ({ ...prev, constructionStatus: v, recommendedService: 'construction' }));
  }, []);

  const setProAuditService = useCallback((v: ProAuditService) => {
    setAssessment(prev => ({ ...prev, proAuditService: v, recommendedService: 'proaudit' }));
  }, []);

  const setPartnerOption = useCallback((v: PartnerOption) => {
    setAssessment(prev => ({ ...prev, partnerOption: v, recommendedService: 'partner_referral' }));
  }, []);

  const setLegalAssistOption = useCallback((v: LegalAssistOption) => {
    setAssessment(prev => ({ ...prev, legalAssistOption: v, recommendedService: 'legalassist' }));
  }, []);

  const setPackageChoice = useCallback((v: PackageChoice) => {
    setAssessment(prev => ({ ...prev, packageChoice: v }));
  }, []);

  const setSpecializedPackage = useCallback((v: SpecializedPackage) => {
    setAssessment(prev => ({ ...prev, specializedPackage: v }));
  }, []);

  const toggleAddOn = useCallback((v: AddOn) => {
    setAssessment(prev => {
      const next = prev.selectedAddOns.includes(v)
        ? prev.selectedAddOns.filter(a => a !== v)
        : [...prev.selectedAddOns, v];
      return { ...prev, selectedAddOns: next };
    });
  }, []);

  const setPropertyDetails = useCallback((v: Partial<AssessmentData>) => {
    setAssessment(prev => ({ ...prev, ...v }));
  }, []);

  const setContactDetails = useCallback((v: Partial<AssessmentData>) => {
    setAssessment(prev => ({ ...prev, ...v }));
  }, []);

  const goNext = useCallback(() => {
    const currentSteps = buildStepSequence(assessment);
    const idx = currentSteps.indexOf(currentStep);
    if (idx < currentSteps.length - 1) setCurrentStep(currentSteps[idx + 1]);
  }, [currentStep, assessment]);

  const goBack = useCallback(() => {
    const currentSteps = buildStepSequence(assessment);
    const idx = currentSteps.indexOf(currentStep);
    if (idx > 0) setCurrentStep(currentSteps[idx - 1]);
  }, [currentStep, assessment]);

  const submitAssessment = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Submission failed. Please try again.');
      }
      setCurrentStep('confirmation');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }, [assessment]);

  return (
    <AssessmentContext.Provider value={{
      assessment, currentStep, stepIndex, totalSteps, progressPercent,
      isSubmitting, submitError, isCondo, isHouseType, isSkipPackageType,
      setUserType, setPropertyType, setBuyerPropertySubType,
      setOwnerSituation, setRepairCompletedBy, setWantReinspection,
      setConstructionStatus, setProAuditService, setPartnerOption, setLegalAssistOption,
      setPackageChoice, setSpecializedPackage, toggleAddOn,
      setPropertyDetails, setContactDetails,
      goNext, goBack, submitAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
