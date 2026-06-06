'use client';

import { useState, useEffect, useRef } from 'react';
import { useAssessment } from '../AssessmentContext';

declare global {
  interface Window {
    google: typeof google;
    initGooglePlaces: () => void;
  }
}

export function PropertyDetailsStep() {
  const { assessment, setPropertyDetails, goNext } = useAssessment();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLotLand = assessment.propertyType === 'lot_land';

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressInputRef.current) return;
    const initAutocomplete = () => {
      if (!window.google?.maps?.places || !addressInputRef.current) return;
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        { componentRestrictions: { country: 'ph' }, fields: ['formatted_address', 'place_id', 'geometry'], types: ['address'] }
      );
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setPropertyDetails({ propertyAddress: place.formatted_address, propertyAddressPlaceId: place.place_id ?? '' });
        }
      });
    };
    if (window.google?.maps?.places) { initAutocomplete(); }
    else if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
      script.async = true; script.defer = true;
      window.initGooglePlaces = initAutocomplete;
      document.head.appendChild(script);
    } else { window.initGooglePlaces = initAutocomplete; }
  }, [setPropertyDetails]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!assessment.propertyAddress.trim()) e.propertyAddress = 'Please enter the property address.';
    if (!assessment.floorArea || assessment.floorArea <= 0) e.floorArea = 'Please enter the floor area.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tell us about your property</h2>
        <p className="text-gray-500 text-sm mt-1">This helps PHILinspect prepare the right inspection plan.</p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Property Address <span className="text-red-500">*</span>
        </label>
        <input
          ref={addressInputRef}
          type="text"
          placeholder="Start typing your property address..."
          defaultValue={assessment.propertyAddress}
          onChange={(e) => setPropertyDetails({ propertyAddress: e.target.value })}
          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.propertyAddress ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.propertyAddress && <p className="text-xs text-red-500 mt-1">{errors.propertyAddress}</p>}
        <p className="text-xs text-gray-400 mt-1">Start typing and select from the suggestions.</p>
      </div>

      {/* Floor Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {isLotLand ? 'Lot Area (sqm)' : 'Floor Area (sqm)'} <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 80"
          value={assessment.floorArea ?? ''}
          onChange={(e) => setPropertyDetails({ floorArea: e.target.value ? Number(e.target.value) : null })}
          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${errors.floorArea ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.floorArea && <p className="text-xs text-red-500 mt-1">{errors.floorArea}</p>}
      </div>

      {/* Number of Floors — hide for Lot/Land */}
      {!isLotLand && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Floors</label>
          <select
            value={assessment.numberOfFloors ?? ''}
            onChange={(e) => setPropertyDetails({ numberOfFloors: e.target.value ? Number(e.target.value) : null })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white"
          >
            <option value="">Select number of floors</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Floor' : 'Floors'}</option>)}
            <option value="6">6+ Floors</option>
          </select>
        </div>
      )}

      {/* Furnished / Occupied — hide for Lot/Land */}
      {!isLotLand && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Is the property furnished?</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: true, label: '🛋️ Furnished' }, { value: false, label: '📦 Unfurnished' }].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setPropertyDetails({ furnished: opt.value })}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    assessment.furnished === opt.value
                      ? 'border-gray-900 bg-gray-50 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Is the property currently occupied?</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: true, label: '👥 Occupied' }, { value: false, label: '🔒 Vacant' }].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setPropertyDetails({ occupied: opt.value })}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    assessment.occupied === opt.value
                      ? 'border-gray-900 bg-gray-50 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Preferred Inspection Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Inspection Date</label>
        <input
          type="date"
          value={assessment.preferredInspectionDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setPropertyDetails({ preferredInspectionDate: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">This is a preference only. Our team will confirm the schedule.</p>
      </div>

      <button
        type="button"
        onClick={() => { if (validate()) goNext(); }}
        className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl text-base transition-colors shadow-md shadow-gray-300 mt-2"
      >
        Continue →
      </button>
    </div>
  );
}
