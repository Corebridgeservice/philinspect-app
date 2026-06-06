'use client';

import { useState, useEffect } from 'react';
import { useAssessment } from '../AssessmentContext';

const TIME_OPTIONS = [
  '8:00 AM – 9:00 AM', '9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM', '1:00 PM – 2:00 PM', '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM',
];

const HEAR_ABOUT_US_OPTIONS = [
  'Google Search',
  'Facebook',
  'Instagram',
  'YouTube',
  'Referral from a Friend or Family',
  'Real Estate Agent / Broker',
  'Developer / Property Management',
  'Lawyer / Legal Representative',
  'Online Advertisement',
  'Blog or Article',
  'Other',
];

const CONTACT_METHODS = [
  { value: 'mobile_call', label: '📞 Mobile Call', needsNumber: true, placeholder: 'e.g. 09171234567', type: 'tel' },
  { value: 'sms', label: '💬 SMS / Text', needsNumber: true, placeholder: 'e.g. 09171234567', type: 'tel' },
  { value: 'email', label: '✉️ Email', needsNumber: false, placeholder: '', type: 'email' },
  { value: 'viber', label: '📱 Viber', needsNumber: true, placeholder: 'e.g. 09171234567', type: 'tel' },
  { value: 'whatsapp', label: '💚 WhatsApp', needsNumber: true, placeholder: 'e.g. +639171234567', type: 'tel' },
];

export function ContactDetailsStep() {
  const { assessment, setContactDetails, submitAssessment, isSubmitting, submitError } = useAssessment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedMethod = CONTACT_METHODS.find(m => m.value === assessment.bestContactMethod);

  // When user selects Email as preferred contact, auto-fill with their email
  useEffect(() => {
    if (assessment.bestContactMethod === 'email' && assessment.email) {
      // Email is already in the email field — nothing extra needed
    }
  }, [assessment.bestContactMethod, assessment.email]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!assessment.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!assessment.mobile.trim()) {
      e.mobile = 'Please enter your mobile number.';
    } else if (!/^(\+63|0)[0-9]{9,10}$/.test(assessment.mobile.replace(/\s/g, ''))) {
      e.mobile = 'Please enter a valid Philippine mobile number (e.g. 09171234567).';
    }
    if (!assessment.email.trim()) {
      e.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assessment.email)) {
      e.email = 'Please enter a valid email address.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  const selectClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your contact details</h2>
        <p className="text-gray-500 text-sm mt-1">
          Our team will reach out to confirm your inspection schedule and details.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Juan dela Cruz"
          value={assessment.fullName}
          onChange={(e) => setContactDetails({ fullName: e.target.value })}
          className={inputClass('fullName')}
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="e.g. 09171234567"
          value={assessment.mobile}
          onChange={(e) => setContactDetails({ mobile: e.target.value })}
          className={inputClass('mobile')}
        />
        {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="e.g. juan@email.com"
          value={assessment.email}
          onChange={(e) => setContactDetails({ email: e.target.value })}
          className={inputClass('email')}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Preferred to contact <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <select
          value={assessment.bestContactMethod}
          onChange={(e) => setContactDetails({ bestContactMethod: e.target.value })}
          className={selectClass}
        >
          <option value="">Select preferred contact method</option>
          {CONTACT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Dynamic field based on preferred contact method */}
      {selectedMethod && selectedMethod.needsNumber && (
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {selectedMethod.label.replace(/^[^\s]+ /, '')} Number
          </label>
          <input
            type={selectedMethod.type}
            placeholder={selectedMethod.placeholder}
            value={
              assessment.bestContactMethod === 'viber' ? assessment.viber :
              assessment.bestContactMethod === 'whatsapp' ? assessment.whatsapp :
              assessment.mobile
            }
            onChange={(e) => {
              if (assessment.bestContactMethod === 'viber') setContactDetails({ viber: e.target.value });
              else if (assessment.bestContactMethod === 'whatsapp') setContactDetails({ whatsapp: e.target.value });
              else setContactDetails({ mobile: e.target.value });
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            We will use this number to contact you.
          </p>
        </div>
      )}

      {/* Email auto-fill notice */}
      {assessment.bestContactMethod === 'email' && assessment.email && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-600">
            ✉️ We will contact you at: <span className="font-semibold text-gray-800">{assessment.email}</span>
          </p>
        </div>
      )}

      {/* Where did you hear about us */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Where did you hear about us? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <select
          value={assessment.hearAboutUs}
          onChange={(e) => setContactDetails({ hearAboutUs: e.target.value })}
          className={selectClass}
        >
          <option value="">Select an option</option>
          {HEAR_ABOUT_US_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Preferred Call Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Preferred Call Date
        </label>
        <input
          type="date"
          value={assessment.preferredCallDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setContactDetails({ preferredCallDate: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>

      {/* Preferred Call Time */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Preferred Call Time
        </label>
        <select
          value={assessment.preferredCallTime}
          onChange={(e) => setContactDetails({ preferredCallTime: e.target.value })}
          className={selectClass}
        >
          <option value="">Select a time slot</option>
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Privacy note */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          🔒 Your information is kept private and will only be used by PHILinspect to prepare your inspection recommendation and quotation.
        </p>
      </div>

      <button
        type="button"
        onClick={async () => { if (validate()) await submitAssessment(); }}
        disabled={isSubmitting}
        className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300 mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : 'Submit Assessment →'}
      </button>
    </div>
  );
}
