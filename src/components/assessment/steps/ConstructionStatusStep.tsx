'use client';

import { ConstructionStatus } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: ConstructionStatus; icon: string; label: string; description: string }[] = [
  { id: 'about_to_start', icon: '📐', label: 'Construction is about to start', description: 'Planning stage — get inspections set up before breaking ground' },
  { id: 'ongoing', icon: '🏗️', label: 'Construction is ongoing', description: 'Currently under construction — stage-by-stage inspections' },
  { id: 'almost_complete', icon: '🔨', label: 'Construction is almost complete', description: 'Nearing completion — punchlisting and pre-turnover inspection' },
  { id: 'completed', icon: '🏠', label: 'Construction is completed', description: 'Already built — final inspection and documentation' },
  { id: 'progress_billing', icon: '💰', label: 'Progress Billing Validation', description: 'Verify contractor billing matches actual construction progress' },
  { id: 'accomplishment_report', icon: '📊', label: 'Percentage of Accomplishment Report', description: 'Independent report on percentage of work completed' },
];

export function ConstructionStatusStep() {
  const { assessment, setConstructionStatus, goNext } = useAssessment();

  const handleSelect = (id: ConstructionStatus) => {
    setConstructionStatus(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Owner-Builder</p>
        <h2 className="text-xl font-bold text-gray-900">What is the construction status?</h2>
        <p className="text-gray-500 text-sm mt-1">This helps us recommend the right construction inspection package.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label} description={opt.description}
            selected={assessment.constructionStatus === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
