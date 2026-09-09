"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useLiveWeather } from "@/lib/useLiveWeather";

export type Consent = "unset" | "granted" | "denied";

const WEATHER_REFRESH_MS = 15 * 60 * 1000;

interface WeatherContextValue {
  consent: Consent;
  setConsent: (next: Consent) => void;
  weather: ReturnType<typeof useLiveWeather>;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

/**
 * A single shared source of location consent + live weather for the whole
 * page, so the "Live" section's readout and the ambient sky backdrop don't
 * each run their own geolocation/weather fetch (and refresh interval) behind
 * the same consent flag.
 */
export function WeatherProvider({ children }: { children: ReactNode }) {
  const { value: consent, setValue: setConsent } = useLocalStorage<Consent>("liveDemoConsent", "unset");
  const weather = useLiveWeather(consent === "granted", WEATHER_REFRESH_MS);

  return <WeatherContext.Provider value={{ consent, setConsent, weather }}>{children}</WeatherContext.Provider>;
}

export function useWeatherContext(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeatherContext must be used within a WeatherProvider");
  return ctx;
}
