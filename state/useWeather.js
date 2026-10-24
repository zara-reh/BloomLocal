import { useEffect, useState } from 'react';
import { fetchWeather } from '../data/weather';

const REFRESH_MINUTES = 15;

// The current weather for a location ({ latitude, longitude }), refreshed every few minutes.
// status is 'loading', 'ready', or 'error'.
export function useWeather(location) {
  const [result, setResult] = useState({ status: 'loading', weather: null });
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;

  useEffect(() => {
    if (latitude === null) {
      setResult({ status: 'error', weather: null });
      return;
    }

    let ignore = false;
    const load = () => {
      fetchWeather(latitude, longitude)
        .then((weather) => !ignore && setResult({ status: 'ready', weather }))
        .catch(() => !ignore && setResult((previous) => (previous.weather ? previous : { status: 'error', weather: null })));
    };

    setResult({ status: 'loading', weather: null });
    load();
    const timer = setInterval(load, REFRESH_MINUTES * 60 * 1000);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [latitude, longitude]);

  return result;
}
