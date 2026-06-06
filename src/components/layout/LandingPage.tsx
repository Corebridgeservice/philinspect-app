'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AssessmentProvider } from '@/components/assessment/AssessmentContext';
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow';

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-white px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Brand badge */}
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
          <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
            PHILinspect Smart Inspection Finder
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Find the Right Property<br />
          <span className="text-gray-900">Inspection in Minutes</span>
        </h1>

        <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          Answer a few simple questions and PHILinspect will recommend the right inspection service for your property.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg shadow-gray-300"
        >
          Start Assessment
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <p className="text-xs text-gray-400 mt-3">
          Free · Takes 3–5 minutes · No commitment required
        </p>
      </div>
    </section>
  );
}

function TrustSection() {
  const badges = [
    { icon: '🔍', title: 'Independent Inspection', desc: 'Unbiased technical reports you can trust' },
    { icon: '📋', title: 'Technical Report Ready', desc: 'Detailed findings delivered after every inspection' },
    { icon: '🏠', title: 'For Buyers, Owners & More', desc: 'Serving buyers, owners, builders, and legal cases' },
  ];

  return (
    <section className="bg-gray-50 px-4 py-12 border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <span className="text-3xl block mb-2">{b.icon}</span>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({ onStart }: { onStart: () => void }) {
  const steps = [
    { num: '01', icon: '💬', title: 'Tell us about your property', desc: 'Answer a few simple questions about your property and your situation.' },
    { num: '02', icon: '🔎', title: 'Choose your concern', desc: 'Tell us what you want to check or what issue you are facing.' },
    { num: '03', icon: '⭐', title: 'PHILinspect identifies the right service', desc: 'We match your answers to the most appropriate inspection service.' },
    { num: '04', icon: '📦', title: 'Our team prepares your quotation', desc: 'PHILinspect reviews your details and sends you a complete inspection package and schedule.' },
  ];

  return (
    <section className="bg-white px-4 py-14 border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 text-sm mt-2">Simple, fast, and designed for Filipino property owners.</p>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{step.num}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg">{step.icon}</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-lg shadow-gray-300"
          >
            Start My Assessment
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-4 py-8 text-center">
      <div className="mb-3">
        <Image
          src="/philinspect-logo.png"
          alt="PHILinspect"
          width={140}
          height={42}
          className="h-9 w-auto object-contain mx-auto brightness-0 invert opacity-70"
        />
      </div>
      <p className="text-xs">Independent Property Inspection Services · Philippines</p>
      <p className="text-xs mt-2 text-gray-600">© {new Date().getFullYear()} PHILinspect. All rights reserved.</p>
    </footer>
  );
}

export function LandingPage() {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return (
      <AssessmentProvider>
        <AssessmentFlow />
      </AssessmentProvider>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple top bar with logo — doesn't interfere with the original layout */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Image
          src="/philinspect-logo.png"
          alt="PHILinspect"
          width={150}
          height={45}
          className="h-9 w-auto object-contain"
          priority
        />
        <button
          type="button"
          onClick={() => setShowAssessment(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Start Assessment
        </button>
      </div>

      <HeroSection onStart={() => setShowAssessment(true)} />
      <TrustSection />
      <HowItWorksSection onStart={() => setShowAssessment(true)} />
      <Footer />
    </div>
  );
}
