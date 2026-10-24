export const FALLBACK_ZONE = '8b';

const USDA_TABLE =
  'https://services1.arcgis.com/SyUSN23vOoYdfLC8/arcgis/rest/services/PHZM_2023_Zip_Code_Table/FeatureServer/296/query';

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('request failed');
  }
  return response.json();
}

// The zone from the USDA Plant Hardiness Zone Map (2023) zip code table, for example '9a'.
async function usdaZone(zip, signal) {
  const data = await getJson(`${USDA_TABLE}?where=ZIP_CODE%3D%27${zip}%27&outFields=Class&returnGeometry=false&f=json`, signal);
  if (!data.features || data.features.length === 0) {
    throw new Error('zip code not found');
  }
  return data.features[0].attributes.Class.split(' ')[0].toLowerCase();
}

// Where the zip code is, needed for the weather. A missing location is not an error.
async function zipLocation(zip, signal) {
  try {
    const data = await getJson(`https://api.zippopotam.us/us/${zip}`, signal);
    const place = data.places[0];
    return { latitude: Number(place.latitude), longitude: Number(place.longitude) };
  } catch {
    return null;
  }
}

// Looks up the USDA hardiness zone and the location of a zip code. If the zone cannot be found
// (unknown zip, no internet, slow response) it returns the fallback zone.
export async function lookupZone(zip) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const [zone, location] = await Promise.all([usdaZone(zip, controller.signal), zipLocation(zip, controller.signal)]);
    return { zone, found: true, location };
  } catch {
    return { zone: FALLBACK_ZONE, found: false, location: null };
  } finally {
    clearTimeout(timer);
  }
}
