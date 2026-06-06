'use client';

import { useAssessment } from '../AssessmentContext';

export function WantReinspectionStep() {
  const { assessment, setWantReinspection, goNext } = useAssessment();

  const sit = assessment.ownerSituation;
  const label = sit === 'near_turnover'
    ? 'Would you like PHILinspect to return after repairs are completed?'
    : sit === 'defects_under_warranty'
    ? 'Would you like PHILinspect to reinspect after repairs are completed?'
    : 'Would you like PHILinspect to return after repairs are completed?';

  const handleSelect = (v: boolean) => {
    setWantReinspection(v);
    setTimeout(() => goNext(), 200);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Optional Add-on</p>
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>
        <p className="text-gray-500 text-sm mt-1">
          A reinspection verifies that all defects have been properly repaired.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            assessment.wantReinspection === true
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className={`font-semibold text-sm ${assessment.wantReinspection === true ? 'text-gray-900' : 'text-gray-800'}`}>
                Yes — add a reinspection
              </p>
              <p className="text-xs text-gray-500 mt-0.5">PHILinspect will return after repairs are completed</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            assessment.wantReinspection === false
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">➡️</span>
            <div>
              <p className={`font-semibold text-sm ${assessment.wantReinspection === false ? 'text-gray-900' : 'text-gray-800'}`}>
                No — just the initial inspection
              </p>
              <p className="text-xs text-gray-500 mt-0.5">I'll decide later if I need a reinspection</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
