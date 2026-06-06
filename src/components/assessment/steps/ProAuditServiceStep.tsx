'use client';

import { ProAuditService } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: ProAuditService; icon: string; label: string }[] = [
  { id: 'quality_audit', icon: '🔍', label: 'Independent Quality Audit' },
  { id: 'progress_billing', icon: '💰', label: 'Progress Billing Validation' },
  { id: 'accomplishment_report', icon: '📊', label: 'Percentage of Accomplishment Report' },
  { id: 'defect_documentation', icon: '📋', label: 'Defect Documentation' },
  { id: 'third_party_qa', icon: '✅', label: 'Third-Party Quality Assurance Support' },
  { id: 'third_party_report', icon: '📄', label: 'Third-Party Inspection Report' },
  { id: 'punchlisting', icon: '📝', label: 'Punchlisting Audit' },
  { id: 'turnover_readiness', icon: '🔑', label: 'Turnover Readiness Audit' },
  { id: 'bulk_unit', icon: '🏢', label: 'Bulk Unit Inspection' },
  { id: 'common_area', icon: '🏛️', label: 'Common Area Inspection' },
  { id: 'construction_monitoring', icon: '🏗️', label: 'Construction Monitoring Support' },
  { id: 'not_sure', icon: '💬', label: 'Not Sure — Let PHILinspect recommend' },
];

export function ProAuditServiceStep() {
  const { assessment, setProAuditService, goNext } = useAssessment();

  const handleSelect = (id: ProAuditService) => {
    setProAuditService(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">ProAudit</p>
        <h2 className="text-xl font-bold text-gray-900">What ProAudit service do you need?</h2>
        <p className="text-gray-500 text-sm mt-1">Select the service that best matches your requirement.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label}
            selected={assessment.proAuditService === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
