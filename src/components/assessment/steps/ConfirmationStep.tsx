'use client';

import { useAssessment } from '../AssessmentContext';
import { SERVICES } from '@/config/services';

export function ConfirmationStep() {
  const { assessment } = useAssessment();
  const service = assessment.recommendedService ? SERVICES[assessment.recommendedService] : null;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? '#';

  return (
    <div className="flex flex-col items-center text-center py-6 gap-6">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Thank you for completing<br />the PHILinspect Assessment.
        </h2>
        <p className="text-gray-500 text-base mt-3 leading-relaxed max-w-sm mx-auto">
          Our team will review your property details and prepare the recommended inspection package, quotation, and schedule.
        </p>
      </div>

      {/* What happens next */}
      <div className="w-full bg-gray-50 rounded-2xl p-5 text-left border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">What happens next?</p>
        <div className="flex flex-col gap-3">
          {[
            { icon: '📋', text: 'PHILinspect reviews your property details' },
            { icon: '📦', text: 'We prepare your recommended inspection package' },
            { icon: '💬', text: 'Our team contacts you to confirm the schedule' },
            { icon: '🏠', text: 'Your inspection is carried out by our certified inspectors' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{step.icon}</span>
              <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended service */}
      {service && (
        <div className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 text-left">
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">Recommended Service</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{service.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{service.label}</p>
              <p className="text-xs text-gray-500">{service.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next step */}
      <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Next Step</p>
        <p className="text-sm text-blue-700 font-medium">PHILinspect Team Review</p>
        <p className="text-xs text-blue-500 mt-0.5">Our team will reach out within 1–2 business days.</p>
      </div>

      <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
        className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300 text-center block">
        📅 Book Consultation Call
      </a>

      <p className="text-xs text-gray-400">
        You will receive a confirmation email at{' '}
        <span className="font-medium text-gray-600">{assessment.email}</span>
      </p>
    </div>
  );
}
