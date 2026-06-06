'use client';

import { PartnerOption } from '@/types/assessment';
import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';

const OPTIONS: { id: PartnerOption; icon: string; label: string; description: string }[] = [
  { id: 'inspection_for_client', icon: '🔍', label: 'Inspection for Client', description: 'Book an inspection for one of your clients' },
  { id: 'become_partner', icon: '🤝', label: 'Become a PHILpartner', description: 'Join the PHILinspect referral and partner network' },
  { id: 'partnership_presentation', icon: '📊', label: 'Request Partnership Presentation', description: 'Get a full overview of the PHILinspect partner program' },
  { id: 'refer_client', icon: '📨', label: 'Refer a Client', description: 'Refer a buyer or owner to PHILinspect' },
  { id: 'book_call', icon: '📞', label: 'Book a Call', description: 'Speak with the PHILinspect team directly' },
];

export function PartnerOptionStep() {
  const { assessment, setPartnerOption, goNext } = useAssessment();

  const handleSelect = (id: PartnerOption) => {
    setPartnerOption(id);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Partner / Referral</p>
        <h2 className="text-xl font-bold text-gray-900">What do you need?</h2>
        <p className="text-gray-500 text-sm mt-1">Select the option that best describes what you're looking for.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.id} icon={opt.icon} label={opt.label} description={opt.description}
            selected={assessment.partnerOption === opt.id}
            onClick={() => handleSelect(opt.id)} />
        ))}
      </div>
    </div>
  );
}
