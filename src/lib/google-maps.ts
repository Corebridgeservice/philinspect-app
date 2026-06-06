// ============================================================
// PHILinspect — Google Maps Integration (Server-side)
// PRIVATE: Distance calculation is internal only.
// ============================================================

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? '';
const OFFICE_ADDRESS =
  process.env.PHILINSPECT_OFFICE_ADDRESS ?? 'Metro Manila, Philippines';

export interface DistanceResult {
  distanceKm: number | null;
  durationText: string | null;
  error?: string;
}

/**
 * Calculate driving distance from PHILinspect office to the property address
 * using Google Distance Matrix API.
 * Returns null if API key is not configured or request fails.
 */
export async function calculateDistanceFromOffice(
  destinationAddress: string
): Promise<DistanceResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[google-maps] GOOGLE_MAPS_API_KEY not configured — skipping distance calculation.');
    return { distanceKm: null, durationText: null, error: 'API key not configured' };
  }

  try {
    const params = new URLSearchParams({
      origins: OFFICE_ADDRESS,
      destinations: destinationAddress,
      key: GOOGLE_MAPS_API_KEY,
      mode: 'driving',
      units: 'metric',
    });

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix API error: ${data.status}`);
    }

    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      throw new Error(`Element status: ${element?.status ?? 'unknown'}`);
    }

    const distanceMeters: number = element.distance.value;
    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
    const durationText: string = element.duration.text;

    return { distanceKm, durationText };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[google-maps] Distance calculation failed:', message);
    return { distanceKm: null, durationText: null, error: message };
  }
}

/**
 * Check if Google Maps API is configured.
 */
export function isGoogleMapsConfigured(): boolean {
  return Boolean(GOOGLE_MAPS_API_KEY);
}
