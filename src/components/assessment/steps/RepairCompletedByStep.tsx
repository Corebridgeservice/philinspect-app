'use client';

import { RepairCompletedBy } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: RepairCompletedBy; icon: string; label: string }[] = [
  { id: 'developer', icon: '🏢', label: 'Developer' },
  { id: 'contractor', icon: '🔧', label: 'Contractor' },
  { id: 'renovation_contractor', icon: '🏗️', label: 'Renovation Contractor' },
  { id: 'insurance_provider', icon: '🛡️', label: 'Insurance Provider' },
  { id: 'other', icon: '💬', label: 'Other' },
];

export function RepairCompletedByStep() {
  const { assessment, setRepairCompletedBy, goNext } = useAssessment();

  const handleSelect = (id: RepairCompletedBy) => {
    setRepairCompletedBy(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Post Defect Rectification</p>
        <h2 className="text-xl font-bold text-gray-900">Who completed the repairs?</h2>
        <p className="text-gray-500 text-sm mt-1">This helps us document the repair history in our report.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label}
            selected={assessment.repairCompletedBy === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
