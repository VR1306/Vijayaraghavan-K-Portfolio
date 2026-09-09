"use client";

import { useCallback, useEffect, useState } from "react";

export interface LocationInfo {
  lat: number;
  lon: number;
  source: "gps" | "ip";
  city?: string;
  country?: string;
  ip?: string;
}

export interface CurrentWeather {
  temperatureC: number;
  humidity: number;
  windKph: number;
  code: number;
  /** ISO 8601 local time (no offset) for today, from Open-Meteo's `timezone=auto`. */
  sunrise?: string;
  sunset?: string;
}

export interface ForecastDay {
  date: string;
  code: number;
  maxC: number;
  minC: number;
}

type Status = "idle" | "locating" | "loading-weather" | "success" | "error";

interface State {
  status: Status;
  location: LocationInfo | null;
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  error: string | null;
}

const INITIAL_STATE: State = {
  status: "idle",
  location: null,
  current: null,
  forecast: [],
  error: null,
};

function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

async function fetchIpLocation(): Promise<LocationInfo> {
  const res = await fetch("/api/geo");
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Couldn't estimate location from IP.");
  }
  return {
    lat: data.lat,
    lon: data.lon,
    source: "ip",
    city: data.city,
    country: data.country,
    ip: data.ip,
  };
}

async function fetchWeather(lat: number, lon: number) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Couldn't load weather.");
  }
  return { current: data.current as CurrentWeather, forecast: data.forecast as ForecastDay[] };
}

/**
 * Runs only when `enabled` is true (i.e. the visitor has consented). Tries
 * the browser's native Geolocation API first; if that's denied, unsupported,
 * or times out, it falls back to a coarse IP-based estimate via our own
 * /api/geo route rather than failing outright.
 *
 * `refreshMs`, if given, re-fetches on that interval so long as the tab is
 * visible (skipped while backgrounded, to avoid pointless calls) — used by
 * the ambient sky backdrop to keep conditions current without re-running
 * geolocation on every refresh.
 */
export function useLiveWeather(enabled: boolean, refreshMs?: number) {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const run = useCallback(async () => {
    setState({ ...INITIAL_STATE, status: "locating" });

    let location: LocationInfo;
    try {
      const position = await getBrowserPosition();
      location = { lat: position.coords.latitude, lon: position.coords.longitude, source: "gps" };
    } catch {
      try {
        location = await fetchIpLocation();
      } catch (err) {
        setState({
          ...INITIAL_STATE,
          status: "error",
          error: err instanceof Error ? err.message : "Couldn't determine your location.",
        });
        return;
      }
    }

    setState((prev) => ({ ...prev, status: "loading-weather", location }));

    try {
      const { current, forecast } = await fetchWeather(location.lat, location.lon);
      setState({ status: "success", location, current, forecast, error: null });
    } catch (err) {
      setState({
        status: "error",
        location,
        current: null,
        forecast: [],
        error: err instanceof Error ? err.message : "Couldn't load weather.",
      });
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: kick off the async geolocation+weather flow when consent turns on
      run();
    } else {
      setState(INITIAL_STATE);
    }
  }, [enabled, run]);

  useEffect(() => {
    if (!enabled || !refreshMs) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") run();
    }, refreshMs);
    return () => clearInterval(id);
  }, [enabled, refreshMs, run]);

  return { ...state, retry: run };
}
