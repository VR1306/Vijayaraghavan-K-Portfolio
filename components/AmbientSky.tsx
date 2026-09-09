"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useWeatherContext } from "@/lib/WeatherProvider";
import { useSkyPhase } from "@/lib/useSkyPhase";
import { describeWeatherCode, type WeatherIconGroup } from "@/lib/weatherCodes";

interface Cloud {
  top: number;
  scale: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Star {
  top: number;
  left: number;
  size: number;
  delay: number;
}

function useRandomLayout<T>(count: number, mounted: boolean, factory: () => T): T[] {
  return useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: count }, factory);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- generated once per mount, stable for the session
  }, [mounted]);
}

const CLOUD_SVG_PATH = "M7.5 17.5h9.2a3.6 3.6 0 0 0 0-7.2 5.3 5.3 0 0 0-10.2-1.7 3.9 3.9 0 0 0 1 8.9Z";

let bodyIdCounter = 0;

/** A compass-rose sun, echoing the site's own logo mark (circle + radiating spokes). */
function Sun() {
  const [id] = useState(() => `sun-${bodyIdCounter++}`);
  return (
    <svg viewBox="0 0 64 64" className="ambient-sky__sun" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--sun-core)" />
          <stop offset="55%" stopColor="var(--sun-mid)" />
          <stop offset="100%" stopColor="var(--sun-edge)" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--sun-mid)" stopOpacity="0.7" />
          <stop offset="60%" stopColor="var(--sun-mid)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--sun-mid)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${id}-halo)`} filter={`url(#${id}-blur)`} />
      <g className="ambient-sky__sun-rays" stroke="var(--sun-mid)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M32 3v10M32 51v10M3 32h10M51 32h10M11.8 11.8l6.7 6.7M45.5 45.5l6.7 6.7M11.8 52.2l6.7-6.7M45.5 18.5l6.7-6.7" />
      </g>
      <circle cx="32" cy="32" r="16" fill={`url(#${id}-core)`} stroke="var(--sun-edge)" strokeWidth="0.8" />
    </svg>
  );
}

/** A crescent moon (same silhouette language as the theme toggle icon) with a soft halo. */
function Moon() {
  const [id] = useState(() => `moon-glow-${bodyIdCounter++}`);
  return (
    <svg viewBox="0 0 64 64" className="ambient-sky__moon" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ink-dim)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--ink-dim)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill={`url(#${id})`} />
      <path
        d="M40 14a18 18 0 1 0 10 26 14 14 0 0 1-10-26Z"
        fill="var(--ink-dim)"
        stroke="var(--line)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function Cloud({ top, scale, duration, delay, opacity }: Cloud) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ambient-sky__cloud"
      style={{
        top: `${top}%`,
        opacity,
        width: `${64 * scale}px`,
        height: `${64 * scale}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <path d={CLOUD_SVG_PATH} fill="var(--surface)" stroke="var(--line)" strokeWidth="0.9" />
    </svg>
  );
}

/**
 * A fixed, decorative sky strip pinned behind the header/hero. It reflects
 * the visitor's real local time (day/night, sunrise/sunset glow) and, once
 * the same location consent used by the "Live" section is granted, current
 * weather (shared via WeatherProvider — this never triggers its own fetch).
 * With no consent it just shows a plain time-based sky, matching the site's
 * opt-in privacy stance.
 */
const SCROLL_FADE_START = 420;
const SCROLL_FADE_END = 860;

export function AmbientSky() {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const { weather } = useWeatherContext();
  const sky = useSkyPhase(weather.current?.sunrise, weather.current?.sunset);
  const [flash, setFlash] = useState(false);
  const [scrollFade, setScrollFade] = useState(1);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard mount-detection pattern (see ThemeToggle), avoids hydration mismatch from local-time-dependent markup
  useEffect(() => setMounted(true), []);

  // The sky is pinned to the viewport (not the page), so without this it
  // would keep floating over whatever section happens to be scrolled under
  // the header — it should only ever read as "behind the hero."
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, (y - SCROLL_FADE_START) / (SCROLL_FADE_END - SCROLL_FADE_START)));
      setScrollFade(1 - t);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const weatherGroup: WeatherIconGroup | null =
    weather.status === "success" && weather.current ? describeWeatherCode(weather.current.code).group : null;

  const showClouds = weatherGroup === "cloudy" || weatherGroup === "rain" || weatherGroup === "snow" || weatherGroup === "storm";
  const showRain = weatherGroup === "rain" || weatherGroup === "storm";
  const showStorm = weatherGroup === "storm";
  const showFog = weatherGroup === "fog";
  const showSnow = weatherGroup === "snow";

  const clouds = useRandomLayout<Cloud>(3, mounted, () => ({
    top: 6 + Math.random() * 22,
    scale: 0.8 + Math.random() * 0.9,
    duration: 50 + Math.random() * 40,
    delay: -Math.random() * 60,
    opacity: 0.35 + Math.random() * 0.25,
  }));

  const stars = useRandomLayout<Star>(36, mounted, () => ({
    top: Math.random() * 55,
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.6,
    delay: Math.random() * 4,
  }));

  useEffect(() => {
    if (!mounted || !showStorm || reduceMotion) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleFlash = () => {
      timeoutId = setTimeout(
        () => {
          setFlash(true);
          setTimeout(() => setFlash(false), 140);
          scheduleFlash();
        },
        4000 + Math.random() * 7000
      );
    };
    scheduleFlash();
    return () => clearTimeout(timeoutId);
  }, [mounted, showStorm, reduceMotion]);

  if (!mounted) {
    return <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
  }

  const arc = sky.sunArc ?? sky.moonArc;
  const showCelestialBody = arc !== null;
  const isSun = sky.sunArc !== null;
  const rise = arc !== null ? Math.sin(Math.PI * arc) : 0;

  return (
    <div
      className="ambient-sky pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: scrollFade, visibility: scrollFade === 0 ? "hidden" : "visible" }}
    >
      <div className="ambient-sky__gradient ambient-sky__gradient--day" style={{ opacity: sky.dayWeight * 0.92 }} />
      <div className="ambient-sky__gradient ambient-sky__gradient--night" style={{ opacity: (1 - sky.dayWeight) * 0.92 }} />
      <div className="ambient-sky__glow" style={{ opacity: sky.glowWeight * 0.55 }} />

      {!showFog && sky.dayWeight < 0.85 && (
        <div className="ambient-sky__stars" style={{ opacity: 1 - sky.dayWeight }}>
          {stars.map((star, i) => (
            <span
              key={i}
              className="ambient-sky__star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {showCelestialBody && (
        <div
          className="ambient-sky__body"
          style={{ left: `${(arc as number) * 100}%`, transform: `translateY(${-rise * 40}px)` }}
        >
          {isSun ? <Sun /> : <Moon />}
        </div>
      )}

      {showClouds && clouds.map((cloud, i) => <Cloud key={i} {...cloud} />)}

      {showFog && (
        <div className="ambient-sky__fog">
          <span className="ambient-sky__fog-band" style={{ top: "18%", animationDuration: "38s" }} />
          <span className="ambient-sky__fog-band" style={{ top: "30%", animationDuration: "52s", animationDelay: "-12s" }} />
          <span className="ambient-sky__fog-band" style={{ top: "42%", animationDuration: "44s", animationDelay: "-25s" }} />
        </div>
      )}

      {showRain && (
        <div className={`ambient-sky__rain ${showStorm ? "ambient-sky__rain--heavy" : ""}`} />
      )}

      {showSnow && <div className="ambient-sky__snow" />}

      {showStorm && <div className="ambient-sky__flash" style={{ opacity: flash ? 1 : 0 }} />}
    </div>
  );
}
