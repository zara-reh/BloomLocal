export const FALLBACK_ZONE = '8b';

// Looks up the USDA hardiness zone and the location of a zip code. If anything goes wrong
// (unknown zip, no internet, slow response) it returns the fallback zone and no location.
export async function lookupZone(zip) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://phzmapi.org/${zip}.json`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error('zip code not found');
    }
    const data = await response.json();
    const location = { latitude: Number(data.coordinates.lat), longitude: Number(data.coordinates.lon) };
    return { zone: data.zone, found: true, location: Number.isNaN(location.latitude) ? null : location };
  } catch {
    return { zone: FALLBACK_ZONE, found: false, location: null };
  } finally {
    clearTimeout(timer);
  }
}
