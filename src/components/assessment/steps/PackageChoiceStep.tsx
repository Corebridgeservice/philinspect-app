'use client';

import { useAssessment } from '../AssessmentContext';
import { OptionCard } from '@/components/ui/OptionCard';
import { PackageChoice, SpecializedPackage, AddOn } from '@/types/assessment';

const PACKAGE_OPTIONS: { id: PackageChoice; icon: string; label: string; description: string }[] = [
  { id: 'recommended', icon: '⭐', label: 'Show me the recommended package', description: 'PHILinspect will select the best package based on your property' },
  { id: 'build_own', icon: '🔧', label: 'I want to build my own package', description: 'Choose specific inspection items that matter to you' },
  { id: 'recommend_by_concern', icon: '💡', label: 'Recommend based on my concern', description: "Tell us what you're worried about and we'll suggest the right checks" },
  { id: 'no_thanks', icon: '➡️', label: 'No thanks — just proceed', description: "I'll leave the package selection to PHILinspect" },
];

// ---- Condo packages (Infrared, Pest, Mold ONLY) ----
const CONDO_PACKAGES: { id: SpecializedPackage; icon: string; label: string; items: string[]; badge: string }[] = [
  { id: 'condo_essential', icon: '🔵', label: 'Essential Package', items: ['Infrared Scan', 'Pest Inspection'], badge: '7% OFF' },
  { id: 'condo_premium', icon: '🟠', label: 'Premium Package', items: ['Infrared Scan', 'Pest Inspection', 'Mold Assessment'], badge: '10% OFF' },
  { id: 'condo_custom', icon: '🔧', label: 'Custom Package', items: ['Choose from: Infrared Scan, Pest Inspection, Mold Assessment'], badge: 'Mix & Match' },
];

// ---- House / Townhouse / Row House / Commercial packages ----
const HOUSE_PACKAGES: { id: SpecializedPackage; icon: string; label: string; items: string[]; badge: string }[] = [
  { id: 'essential', icon: '🔵', label: 'Essential Package', items: ['Infrared Scan', 'Drone Roof Inspection'], badge: '15% OFF' },
  { id: 'premium', icon: '🟠', label: 'Premium Package', items: ['Infrared Scan', 'Pest Inspection', 'Drone Roof Inspection', 'Mold Assessment'], badge: '20% OFF' },
  { id: 'ultimate', icon: '⭐', label: 'Ultimate Package', items: ['Infrared Scan', 'Pest Inspection', 'Drone Roof Inspection', 'Mold Assessment', 'Septic Tank Inspection'], badge: '30% OFF' },
];

// ---- Construction packages ----
const CONSTRUCTION_PACKAGES: { id: SpecializedPackage; icon: string; label: string; items: string[]; badge: string }[] = [
  { id: 'construction_essential', icon: '🔵', label: 'Essential — 5 Inspections', items: ['Pre-Groundbreaking', 'Structural Works', 'Electrical & Plumbing', 'Punchlisting', 'Turnover', '🎁 Free Drone Roof Inspection'], badge: '' },
  { id: 'construction_plus', icon: '🟠', label: 'Plus — 9 Inspections', items: ['Pre-Groundbreaking', 'Excavation & Footings', 'Concrete Pouring', 'Structural Works', 'Roof Installation', 'Electrical & Plumbing', 'Architectural Finishes', 'Punchlisting', 'Turnover', '🎁 Free Drone Roof + Pest Inspection'], badge: '5% OFF' },
  { id: 'construction_premium', icon: '⭐', label: 'Premium — 11 Inspections', items: ['All Plus inspections', 'Concrete Pouring x2', 'Roof Installation x2', '🎁 Free Drone Roof, Pest & Infrared Scan'], badge: '10% OFF' },
  { id: 'construction_ultimate', icon: '🏆', label: 'Ultimate — 15 Inspections', items: ['All Premium inspections', 'Concrete Pouring x4', 'Roof Installation x2', '🎁 Free Drone Roof, Pest, Infrared & Septic Tank'], badge: '15% OFF' },
];

// ---- Add-ons per service type ----
const ADD_ON_OPTIONS: { id: AddOn; icon: string; label: string; description: string; forServices: string[] }[] = [
  {
    id: 'proestimate',
    icon: '💰',
    label: 'ProEstimate',
    description: 'Detailed repair cost estimate based on inspection findings',
    forServices: ['pre_purchase', 'turnover', 'defect_liability', 'post_defect_rectification', 'quality_defect', 'construction', 'legalassist'],
  },
  {
    id: 'scopecheck',
    icon: '📐',
    label: 'ScopeCheck',
    description: 'Review of scope of works, BOQ, or construction plans',
    forServices: ['construction', 'proaudit', 'pre_purchase', 'legalassist'],
  },
  {
    id: 'expert_statement',
    icon: '📜',
    label: 'Expert Statement',
    description: 'Formal expert witness statement for legal proceedings',
    forServices: ['legalassist', 'quality_defect', 'defect_liability'],
  },
];

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: { id: SpecializedPackage; icon: string; label: string; items: string[]; badge: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-xl mt-0.5 flex-shrink-0">{pkg.icon}</span>
          <div>
            <p className={`font-semibold text-sm ${selected ? 'text-gray-900' : 'text-gray-800'}`}>{pkg.label}</p>
            <ul className="mt-1 space-y-0.5">
              {pkg.items.map((item, i) => (
                <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {pkg.badge && (
          <span className="flex-shrink-0 text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
            {pkg.badge}
          </span>
        )}
      </div>
    </button>
  );
}

export function PackageChoiceStep() {
  const {
    assessment,
    setPackageChoice,
    setSpecializedPackage,
    toggleAddOn,
    goNext,
    isCondo,
    isHouseType,
  } = useAssessment();

  const isConstruction = assessment.recommendedService === 'construction';
  const showSpecializedPackages =
    assessment.packageChoice === 'recommended' || assessment.packageChoice === 'build_own';

  // Determine which package set to show
  const packages = isConstruction
    ? CONSTRUCTION_PACKAGES
    : isCondo
    ? CONDO_PACKAGES
    : isHouseType
    ? HOUSE_PACKAGES
    : [];

  // Add-ons filtered by service type
  const availableAddOns = ADD_ON_OPTIONS.filter(a =>
    assessment.recommendedService ? a.forServices.includes(assessment.recommendedService) : false
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Would you like specialized services?</h2>
        <p className="text-gray-500 text-sm mt-1">Optional — you can also leave this to our team.</p>
      </div>

      {/* Package choice selector */}
      <div className="flex flex-col gap-2">
        {PACKAGE_OPTIONS.map(opt => (
          <OptionCard
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={assessment.packageChoice === opt.id}
            onClick={() => setPackageChoice(opt.id)}
          />
        ))}
      </div>

      {/* ---- Condo notice ---- */}
      {isCondo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-700 font-semibold mb-1.5">Condo Unit — Available Specialized Services</p>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {['Infrared Scan', 'Pest Inspection', 'Mold Assessment'].map(s => (
              <span key={s} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ {s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Drone Roof Inspection', 'Septic Tank Inspection', 'Pool / Spa Inspection'].map(s => (
              <span key={s} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">❌ {s}</span>
            ))}
          </div>
        </div>
      )}

      {/* ---- House/Townhouse/Row House/Commercial notice ---- */}
      {isHouseType && !isConstruction && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-xs text-blue-700 font-semibold mb-1.5">Available Specialized Services</p>
          <div className="flex flex-wrap gap-1.5">
            {['Infrared Scan', 'Pest Inspection', 'Drone Roof Inspection', 'Mold Assessment', 'Septic Tank Inspection', 'Pool / Spa Inspection'].map(s => (
              <span key={s} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✅ {s}</span>
            ))}
          </div>
        </div>
      )}

      {/* ---- Specialized packages (only when recommended or build_own selected) ---- */}
      {showSpecializedPackages && packages.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {isConstruction ? 'Construction Packages' : isCondo ? 'Condo Packages' : 'Specialized Packages'}
          </p>
          <div className="flex flex-col gap-3">
            {packages.map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={assessment.specializedPackage === pkg.id}
                onSelect={() => setSpecializedPackage(pkg.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ---- Add-ons (filtered by service type) ---- */}
      {availableAddOns.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Optional Add-ons</p>
          <div className="flex flex-col gap-2">
            {availableAddOns.map(addOn => (
              <OptionCard
                key={addOn.id}
                icon={addOn.icon}
                label={addOn.label}
                description={addOn.description}
                selected={assessment.selectedAddOns.includes(addOn.id)}
                onClick={() => toggleAddOn(addOn.id)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={goNext}
        disabled={!assessment.packageChoice}
        className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300 disabled:shadow-none"
      >
        Continue →
      </button>
    </div>
  );
}
