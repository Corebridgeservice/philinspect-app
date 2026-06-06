'use client';

import { LegalAssistOption } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: LegalAssistOption; icon: string; label: string; description: string }[] = [
  { id: 'defect_documentation', icon: '📋', label: 'Property Defect Documentation', description: 'Formal documentation of property defects for legal use' },
  { id: 'repair_cost_estimate', icon: '💰', label: 'Repair Cost Estimate', description: 'Independent estimate of repair costs for legal proceedings' },
  { id: 'accomplishment_report', icon: '📊', label: 'Percentage of Accomplishment', description: 'Independent report on construction progress and completion' },
  { id: 'expert_inspection_report', icon: '📄', label: 'Expert Inspection Report', description: 'Formal expert report prepared for legal or mediation use' },
  { id: 'court_mediation', icon: '⚖️', label: 'Court / Mediation Support', description: 'Technical support for court hearings or mediation proceedings' },
  { id: 'construction_dispute', icon: '🏗️', label: 'Construction Dispute Support', description: 'Technical assessment for construction-related disputes' },
];

export function LegalAssistOptionStep() {
  const { assessment, setLegalAssistOption, goNext } = useAssessment();

  const handleSelect = (id: LegalAssistOption) => {
    setLegalAssistOption(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">LegalAssist</p>
        <h2 className="text-xl font-bold text-gray-900">What support do you need?</h2>
        <p className="text-gray-500 text-sm mt-1">PHILinspect provides technical reports and expert support for legal cases.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label} description={opt.description}
            selected={assessment.legalAssistOption === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
