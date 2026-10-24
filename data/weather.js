// What a weather code from open-meteo.com means, and which picture goes with it.
function describe(code) {
  if (code === 0) {
    return { condition: 'Clear', icon: 'sun' };
  }
  if (code <= 2) {
    return { condition: 'Partly cloudy', icon: 'partly' };
  }
  if (code === 3) {
    return { condition: 'Cloudy', icon: 'cloud' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Foggy', icon: 'cloud' };
  }
  if (code >= 51 && code <= 57) {
    return { condition: 'Drizzle', icon: 'rain' };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { condition: 'Rainy', icon: 'rain' };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { condition: 'Snowy', icon: 'snow' };
  }
  return { condition: 'Stormy', icon: 'storm' };
}

// The weather right now at a place, from open-meteo.com (free, no key needed).
// Throws if the request fails or takes too long.
export async function fetchWeather(latitude, longitude) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,relative_humidity_2m,weather_code' +
      '&daily=precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=1';
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error('weather request failed');
    }
    const data = await response.json();

    return {
      ...describe(data.current.weather_code),
      temperature: `${Math.round(data.current.temperature_2m)}° F`,
      details: `${Math.round(data.current.relative_humidity_2m)}% Humidity | ${data.daily.precipitation_probability_max[0]}% Chance of Precipitation`,
    };
  } finally {
    clearTimeout(timer);
  }
}
