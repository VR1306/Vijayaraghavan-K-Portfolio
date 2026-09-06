export type WeatherIconGroup = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export interface WeatherCodeInfo {
  label: string;
  group: WeatherIconGroup;
}

// https://open-meteo.com/en/docs — WMO Weather interpretation codes
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", group: "clear" },
  1: { label: "Mainly clear", group: "clear" },
  2: { label: "Partly cloudy", group: "cloudy" },
  3: { label: "Overcast", group: "cloudy" },
  45: { label: "Fog", group: "fog" },
  48: { label: "Depositing rime fog", group: "fog" },
  51: { label: "Light drizzle", group: "rain" },
  53: { label: "Moderate drizzle", group: "rain" },
  55: { label: "Dense drizzle", group: "rain" },
  56: { label: "Freezing drizzle", group: "rain" },
  57: { label: "Dense freezing drizzle", group: "rain" },
  61: { label: "Slight rain", group: "rain" },
  63: { label: "Moderate rain", group: "rain" },
  65: { label: "Heavy rain", group: "rain" },
  66: { label: "Freezing rain", group: "rain" },
  67: { label: "Heavy freezing rain", group: "rain" },
  71: { label: "Slight snow", group: "snow" },
  73: { label: "Moderate snow", group: "snow" },
  75: { label: "Heavy snow", group: "snow" },
  77: { label: "Snow grains", group: "snow" },
  80: { label: "Slight rain showers", group: "rain" },
  81: { label: "Moderate rain showers", group: "rain" },
  82: { label: "Violent rain showers", group: "rain" },
  85: { label: "Slight snow showers", group: "snow" },
  86: { label: "Heavy snow showers", group: "snow" },
  95: { label: "Thunderstorm", group: "storm" },
  96: { label: "Thunderstorm, slight hail", group: "storm" },
  99: { label: "Thunderstorm, heavy hail", group: "storm" },
};

export function describeWeatherCode(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: "Unknown", group: "cloudy" };
}
