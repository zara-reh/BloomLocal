import { useEffect, useState } from 'react';
import { lookupZone } from '../data/zone';

// Looks up the zone whenever the zip code reaches 5 digits.
// status is 'idle', 'loading', 'found', or 'fallback' (the zip could not be looked up).
// location is { latitude, longitude } when the zip was found.
export function useZoneLookup(zip) {
  const [lookup, setLookup] = useState({ status: 'idle', zone: null, location: null });

  useEffect(() => {
    if (zip.length !== 5) {
      setLookup({ status: 'idle', zone: null, location: null });
      return;
    }

    let ignore = false;
    setLookup({ status: 'loading', zone: null, location: null });
    lookupZone(zip).then((result) => {
      if (!ignore) {
        setLookup({ status: result.found ? 'found' : 'fallback', zone: result.zone, location: result.location });
      }
    });
    return () => {
      ignore = true;
    };
  }, [zip]);

  return lookup;
}
