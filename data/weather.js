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

// The weather right now at a place, from open-meteo.com (free, no key needed), plus the rain and
// the high temperature of each of the last few days in history (oldest first, today last).
// Throws if the request fails or takes too long.
export async function fetchWeather(latitude, longitude) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,relative_humidity_2m,weather_code' +
      '&daily=precipitation_probability_max,precipitation_sum,temperature_2m_max' +
      '&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto&past_days=10&forecast_days=1';
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error('weather request failed');
    }
    const data = await response.json();
    const daily = data.daily;
    const last = daily.time.length - 1;

    return {
      ...describe(data.current.weather_code),
      temperature: `${Math.round(data.current.temperature_2m)}° F`,
      details: `${Math.round(data.current.relative_humidity_2m)}% Humidity | ${daily.precipitation_probability_max[last]}% Chance of Precipitation`,
      history: daily.time.map((date, index) => ({
        date,
        rain: daily.precipitation_sum[index] || 0,
        high: daily.temperature_2m_max[index],
      })),
    };
  } finally {
    clearTimeout(timer);
  }
}
