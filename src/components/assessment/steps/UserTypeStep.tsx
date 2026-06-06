'use client';

import { UserType } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const USER_TYPE_OPTIONS: { id: UserType; icon: string; label: string; description: string }[] = [
  {
    id: 'property_buyer',
    icon: '🔑',
    label: 'Property Buyer',
    description: "I'm buying a property and want it inspected first",
  },
  {
    id: 'property_owner',
    icon: '🏠',
    label: 'Property Owner',
    description: 'I already own the property and have concerns',
  },
  {
    id: 'owner_builder',
    icon: '🏗️',
    label: 'Owner-Builder',
    description: "I'm building my own property",
  },
  {
    id: 'contractor_builder',
    icon: '🔧',
    label: 'Contractor / Builder',
    description: 'I build or renovate properties professionally',
  },
  {
    id: 'developer_pm',
    icon: '🏢',
    label: 'Developer / Property Manager',
    description: 'I manage or develop multiple properties',
  },
  {
    id: 'real_estate_agent',
    icon: '🤝',
    label: 'Real Estate Agent / Broker',
    description: 'I refer clients for inspection services',
  },
  {
    id: 'lawyer',
    icon: '⚖️',
    label: 'Lawyer / Legal Representative',
    description: 'I need a technical report for legal purposes',
  },
  {
    id: 'other',
    icon: '💬',
    label: 'Other',
    description: "I'm not sure — I'd like to talk to someone",
  },
];

export function UserTypeStep() {
  const { assessment, setUserType, goNext } = useAssessment();

  const handleSelect = (id: UserType) => {
    setUserType(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">Who are you?</h2>
        <p className="text-gray-500 text-sm mt-1">
          This helps us find the right inspection service for you.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {USER_TYPE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={assessment.userType === opt.id}
            onClick={() => handleSelect(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}
