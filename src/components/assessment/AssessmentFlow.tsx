'use client';

import { useAssessment } from './AssessmentContext';
import { StepWrapper } from './StepWrapper';
import { WelcomeStep } from './steps/WelcomeStep';
import { UserTypeStep } from './steps/UserTypeStep';
import { PropertyTypeStep } from './steps/PropertyTypeStep';
import { BuyerPropertySubTypeStep } from './steps/BuyerPropertySubTypeStep';
import { OwnerSituationStep } from './steps/OwnerSituationStep';
import { RepairCompletedByStep } from './steps/RepairCompletedByStep';
import { WantReinspectionStep } from './steps/WantReinspectionStep';
import { ConstructionStatusStep } from './steps/ConstructionStatusStep';
import { ProAuditServiceStep } from './steps/ProAuditServiceStep';
import { PartnerOptionStep } from './steps/PartnerOptionStep';
import { LegalAssistOptionStep } from './steps/LegalAssistOptionStep';
import { ServiceRecommendationStep } from './steps/ServiceRecommendationStep';
import { PackageChoiceStep } from './steps/PackageChoiceStep';
import { PropertyDetailsStep } from './steps/PropertyDetailsStep';
import { ContactDetailsStep } from './steps/ContactDetailsStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

export function AssessmentFlow() {
  const { currentStep } = useAssessment();

  const isFirst = currentStep === 'welcome';
  const isConfirmation = currentStep === 'confirmation';

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return <WelcomeStep />;
      case 'user_type': return <UserTypeStep />;
      case 'property_type': return <PropertyTypeStep />;
      case 'buyer_property_subtype': return <BuyerPropertySubTypeStep />;
      case 'owner_situation': return <OwnerSituationStep />;
      case 'repair_completed_by': return <RepairCompletedByStep />;
      case 'want_reinspection': return <WantReinspectionStep />;
      case 'construction_status': return <ConstructionStatusStep />;
      case 'proaudit_service': return <ProAuditServiceStep />;
      case 'partner_option': return <PartnerOptionStep />;
      case 'legalassist_option': return <LegalAssistOptionStep />;
      case 'service_recommendation': return <ServiceRecommendationStep />;
      case 'package_choice': return <PackageChoiceStep />;
      case 'property_details': return <PropertyDetailsStep />;
      case 'contact_details': return <ContactDetailsStep />;
      case 'confirmation': return <ConfirmationStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <StepWrapper showProgress={!isFirst && !isConfirmation} showBack={!isFirst && !isConfirmation}>
      {renderStep()}
    </StepWrapper>
  );
}
