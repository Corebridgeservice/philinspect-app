'use client';

import { BuyerPropertySubType } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: BuyerPropertySubType; icon: string; label: string; description: string }[] = [
  { id: 'brand_new', icon: '🏗️', label: 'Brand New Property', description: 'Newly built or pre-selling property from a developer' },
  { id: 'resale', icon: '🏠', label: 'Resale Property', description: 'Previously owned property being sold by the current owner' },
  { id: 'foreclosed', icon: '🔑', label: 'Foreclosed Property', description: 'Bank or government-acquired property being sold' },
  { id: 'not_sure', icon: '❓', label: 'Not Sure', description: "I'm not sure — PHILinspect will help identify the right service" },
];

export function BuyerPropertySubTypeStep() {
  const { assessment, setBuyerPropertySubType, goNext } = useAssessment();

  const handleSelect = (id: BuyerPropertySubType) => {
    setBuyerPropertySubType(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Property Buyer</p>
        <h2 className="text-xl font-bold text-gray-900">What type of property are you buying?</h2>
        <p className="text-gray-500 text-sm mt-1">
          All property types route to a Pre-Purchase Inspection — this helps us tailor the report.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label} description={opt.description}
            selected={assessment.buyerPropertySubType === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
