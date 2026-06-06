'use client';

import { useAssessment } from './AssessmentContext';

interface StepWrapperProps {
  children: React.ReactNode;
  showProgress?: boolean;
  showBack?: boolean;
}

export function StepWrapper({ children, showProgress = true, showBack = true }: StepWrapperProps) {
  const { goBack, progressPercent, stepIndex, totalSteps, currentStep } = useAssessment();

  const isFirst = currentStep === 'welcome';
  const isConfirmation = currentStep === 'confirmation';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {showBack && !isFirst && !isConfirmation && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
                PHILinspect
              </span>
            </div>
          </div>
          {showProgress && !isFirst && !isConfirmation && (
            <div className="w-full">
              <p className="text-xs text-gray-400 mb-1 text-right">Step {stepIndex} of {totalSteps}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-gray-900 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-4 py-6 flex-1 flex flex-col step-enter">
          {children}
        </div>
      </div>
    </div>
  );
}
