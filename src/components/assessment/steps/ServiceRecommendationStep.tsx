'use client';

import { useAssessment } from '../AssessmentContext';
import { SERVICES } from '@/config/services';

export function ServiceRecommendationStep() {
  const { assessment, goNext, isCondo, isHouseType, isSkipPackageType } = useAssessment();
  const service = assessment.recommendedService ? SERVICES[assessment.recommendedService] : null;

  // Turnover Plus upsell content per property type
  const showTurnoverPlus = assessment.ownerSituation === 'near_turnover';
  const showDefectLiabilityPlus = assessment.ownerSituation === 'defects_under_warranty';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-gray-900 text-xs font-semibold uppercase tracking-wide mb-1">Based on your answers</p>
        <h2 className="text-xl font-bold text-gray-900">Here&apos;s what we recommend for you</h2>
        <p className="text-gray-500 text-sm mt-1">PHILinspect will prepare the best inspection package for your property.</p>
      </div>

      {service && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{service.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-0.5">{service.category}</p>
              <h3 className="text-lg font-bold text-gray-900">{service.label}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{service.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Turnover Plus upsell — property-type aware */}
      {showTurnoverPlus && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
            Turnover Plus Package Available
          </p>
          {isCondo ? (
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ Turnover Inspection</li>
              <li>✅ Post Defect Rectification Inspection</li>
            </ul>
          ) : isHouseType ? (
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ Turnover Inspection</li>
              <li>✅ Post Defect Rectification Inspection</li>
              <li>🎁 Free Drone Roof Inspection</li>
            </ul>
          ) : null}
        </div>
      )}

      {/* Defect Liability Plus upsell */}
      {showDefectLiabilityPlus && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
            Defect Liability Plus Package Available
          </p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>✅ Defect Liability Inspection</li>
            <li>✅ Post Defect Rectification Inspection</li>
          </ul>
        </div>
      )}

      {/* Lot/Land notice */}
      {isSkipPackageType && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Custom Assessment</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            For {assessment.propertyType === 'lot_land' ? 'Lot / Land' : 'this property type'}, PHILinspect will prepare a custom assessment and quotation based on your specific requirements.
          </p>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <p className="text-sm text-blue-700 leading-relaxed">
            Based on your answers, PHILinspect will prepare the best inspection recommendation for your property. Our team will review your details and provide a complete quotation.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300"
      >
        Continue →
      </button>
    </div>
  );
}
