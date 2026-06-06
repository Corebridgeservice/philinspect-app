'use client';

import { useAssessment } from '../AssessmentContext';

export function WelcomeStep() {
  const { goNext } = useAssessment();

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
      {/* Logo / Brand */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Find the Right Property<br />Inspection in Minutes
        </h1>
      </div>

      <p className="text-gray-500 text-base leading-relaxed max-w-sm mb-8">
        Answer a few simple questions and PHILinspect will recommend the right inspection service for your property.
      </p>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
        {[
          { icon: '🔍', text: 'Independent Inspection' },
          { icon: '📋', text: 'Technical Report Ready' },
          { icon: '🏠', text: 'For Buyers, Owners & More' },
        ].map((badge) => (
          <div key={badge.text} className="bg-gray-50 rounded-xl p-3 text-center">
            <span className="text-xl block mb-1">{badge.icon}</span>
            <span className="text-xs text-gray-600 leading-tight block">{badge.text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300"
      >
        Start Assessment →
      </button>

      <p className="text-xs text-gray-400 mt-4">
        Takes about 3–5 minutes. No commitment required.
      </p>
    </div>
  );
}
