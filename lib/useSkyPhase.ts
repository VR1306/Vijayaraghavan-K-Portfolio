"use client";

import { useEffect, useState } from "react";

export type SkyPhase = "night" | "dawn" | "day" | "dusk";

export interface SkyState {
  phase: SkyPhase;
  /** 0 (full night) to 1 (full day), ramping smoothly across each twilight window. */
  dayWeight: number;
  /** 0 to 1, peaking at the sunrise/sunset instant and fading out across the twilight window. */
  glowWeight: number;
  /** 0 (at sunrise) to 1 (at sunset) while the sun is up; null the rest of the time. */
  sunArc: number | null;
  /** 0 (at sunset) to 1 (at next sunrise) while the sun is down; null the rest of the time. */
  moonArc: number | null;
}

const TWILIGHT_MS = 45 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const TICK_MS = 60 * 1000;

/** Falls back to fixed civil-ish hours when no real sunrise/sunset is known yet. */
function defaultSunTimes(now: Date): { sunrise: Date; sunset: Date } {
  const sunrise = new Date(now);
  sunrise.setHours(6, 0, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(18, 0, 0, 0);
  return { sunrise, sunset };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function computeSkyState(now: Date, sunriseIso?: string, sunsetIso?: string): SkyState {
  const fallback = defaultSunTimes(now);
  const sunrise = sunriseIso ? new Date(sunriseIso) : fallback.sunrise;
  const sunset = sunsetIso ? new Date(sunsetIso) : fallback.sunset;

  const nowMs = now.getTime();
  const sunriseMs = sunrise.getTime();
  const sunsetMs = sunset.getTime();

  const dawnStart = sunriseMs - TWILIGHT_MS / 2;
  const dawnEnd = sunriseMs + TWILIGHT_MS / 2;
  const duskStart = sunsetMs - TWILIGHT_MS / 2;
  const duskEnd = sunsetMs + TWILIGHT_MS / 2;

  let phase: SkyPhase;
  let dayWeight: number;
  let glowWeight = 0;

  if (nowMs < dawnStart || nowMs >= duskEnd) {
    phase = "night";
    dayWeight = 0;
  } else if (nowMs < dawnEnd) {
    phase = "dawn";
    const t = clamp01((nowMs - dawnStart) / TWILIGHT_MS);
    dayWeight = t;
    glowWeight = 1 - Math.abs(t * 2 - 1);
  } else if (nowMs < duskStart) {
    phase = "day";
    dayWeight = 1;
  } else {
    phase = "dusk";
    const t = clamp01((nowMs - duskStart) / TWILIGHT_MS);
    dayWeight = 1 - t;
    glowWeight = 1 - Math.abs(t * 2 - 1);
  }

  const sunArc = nowMs >= sunriseMs && nowMs <= sunsetMs ? clamp01((nowMs - sunriseMs) / (sunsetMs - sunriseMs)) : null;

  const nextSunriseMs = sunriseMs + DAY_MS;
  const moonArc =
    nowMs > sunsetMs && nowMs < nextSunriseMs ? clamp01((nowMs - sunsetMs) / (nextSunriseMs - sunsetMs)) : null;

  return { phase, dayWeight, glowWeight, sunArc, moonArc };
}

/**
 * Tracks the visitor's local time-of-day as a continuous day/night signal,
 * refined with real sunrise/sunset once weather data supplies them. Recomputes
 * once a minute (and whenever the tab regains visibility) — no need for
 * anything finer for a decorative sky backdrop.
 */
export function useSkyPhase(sunriseIso?: string, sunsetIso?: string): SkyState {
  const [state, setState] = useState<SkyState>(() => computeSkyState(new Date(), sunriseIso, sunsetIso));

  useEffect(() => {
    const recompute = () => setState(computeSkyState(new Date(), sunriseIso, sunsetIso));
    recompute();

    const id = setInterval(recompute, TICK_MS);
    document.addEventListener("visibilitychange", recompute);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", recompute);
    };
  }, [sunriseIso, sunsetIso]);

  return state;
}
