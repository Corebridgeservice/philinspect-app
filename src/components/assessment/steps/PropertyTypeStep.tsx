'use client';

import { PropertyType } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const PROPERTY_TYPE_OPTIONS: { id: PropertyType; icon: string; label: string; description?: string }[] = [
  { id: 'house_and_lot', icon: '🏡', label: 'House and Lot', description: 'Detached or semi-detached residential property' },
  { id: 'condo', icon: '🏙️', label: 'Condo', description: 'Condominium unit in a multi-story building' },
  { id: 'townhouse', icon: '🏘️', label: 'Townhouse', description: 'Multi-floor attached residential unit' },
  { id: 'row_house', icon: '🏠', label: 'Row House', description: 'Single-floor attached residential unit' },
  { id: 'commercial', icon: '🏢', label: 'Commercial Property', description: 'Office, retail, warehouse, or mixed-use' },
  { id: 'lot_land', icon: '🌿', label: 'Lot / Land', description: 'Vacant lot or undeveloped land' },
  { id: 'not_sure', icon: '❓', label: "I'm Not Sure", description: "We'll help you figure it out" },
];

export function PropertyTypeStep() {
  const { assessment, setPropertyType, goNext } = useAssessment();

  const handleSelect = (id: PropertyType) => {
    setPropertyType(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">What type of property is it?</h2>
        <p className="text-gray-500 text-sm mt-1">
          Select the option that best describes your property.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {PROPERTY_TYPE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={assessment.propertyType === opt.id}
            onClick={() => handleSelect(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}
