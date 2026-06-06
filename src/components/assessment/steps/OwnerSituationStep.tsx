'use client';

import { OwnerSituation } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';
import { getSituationsForPropertyType } from '@/config/situation-routing';

// Property type display labels for the header
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house_and_lot: 'House and Lot',
  condo: 'Condo',
  townhouse: 'Townhouse',
  row_house: 'Row House',
  commercial: 'Commercial Property',
  lot_land: 'Lot / Land',
  not_sure: 'Property',
};

export function OwnerSituationStep() {
  const { assessment, setOwnerSituation, goNext } = useAssessment();

  // Get only the situations applicable to the selected property type
  const applicableSituations = getSituationsForPropertyType(assessment.propertyType);

  const propertyLabel = assessment.propertyType
    ? PROPERTY_TYPE_LABELS[assessment.propertyType] ?? 'Property'
    : 'Property';

  const handleSelect = (id: OwnerSituation) => {
    setOwnerSituation(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">
          Property Owner — {propertyLabel}
        </p>
        <h2 className="text-xl font-bold text-gray-900">
          What best describes your situation today?
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          This helps us recommend the most appropriate inspection service for your {propertyLabel.toLowerCase()}.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {applicableSituations.map(situation => (
          <OptionCard
            key={situation.id}
            icon={situation.icon}
            label={situation.label}
            description={situation.description}
            selected={assessment.ownerSituation === situation.id}
            onClick={() => handleSelect(situation.id as OwnerSituation)}
          />
        ))}
      </div>
    </div>
  );
}
