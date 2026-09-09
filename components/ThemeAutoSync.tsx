"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useWeatherContext } from "@/lib/WeatherProvider";
import { useSkyPhase } from "@/lib/useSkyPhase";

export const THEME_MANUAL_KEY = "themeSetManually";

/**
 * Defaults the reading theme to the same day/night signal that drives the
 * ambient sky (real sunrise/sunset when known, otherwise 6am/6pm) — light
 * before evening, dark after — so the two are never inconsistent with each
 * other. Stops the moment the visitor picks a theme themselves via
 * ThemeToggle (flagged in localStorage), and never touches it again this
 * session or on return visits until they clear that choice.
 */
export function ThemeAutoSync() {
  const { setTheme } = useTheme();
  const { weather } = useWeatherContext();
  const sky = useSkyPhase(weather.current?.sunrise, weather.current?.sunset);
  const lastApplied = useRef<"light" | "dark" | null>(null);

  useEffect(() => {
    let manual = false;
    try {
      manual = window.localStorage.getItem(THEME_MANUAL_KEY) === "true";
    } catch {
      // Storage unavailable — fall back to always auto-syncing this session.
    }
    if (manual) return;

    const desired: "light" | "dark" = sky.dayWeight >= 0.5 ? "light" : "dark";
    if (lastApplied.current === desired) return;
    lastApplied.current = desired;
    setTheme(desired);
  }, [sky.dayWeight, setTheme]);

  return null;
}
