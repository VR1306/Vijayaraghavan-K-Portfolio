import type { ReactNode } from "react";
import type { WeatherIconGroup } from "@/lib/weatherCodes";

const PATHS: Record<WeatherIconGroup, ReactNode> = {
  clear: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7" />
    </>
  ),
  cloudy: (
    <>
      <path d="M7.5 17.5h9.2a3.6 3.6 0 0 0 0-7.2 5.3 5.3 0 0 0-10.2-1.7 3.9 3.9 0 0 0 1 8.9Z" />
    </>
  ),
  fog: (
    <>
      <path d="M4 9.5h16M4 13h16M4 16.5h11" />
    </>
  ),
  rain: (
    <>
      <path d="M7.5 14.3h9.2a3.6 3.6 0 0 0 0-7.2 5.3 5.3 0 0 0-10.2-1.7 3.9 3.9 0 0 0 1 8.9Z" />
      <path d="M8.5 18.5l-1.2 2.3M12.5 18.5l-1.2 2.3M16.5 18.5l-1.2 2.3" />
    </>
  ),
  snow: (
    <>
      <path d="M7.5 13.3h9.2a3.6 3.6 0 0 0 0-7.2 5.3 5.3 0 0 0-10.2-1.7 3.9 3.9 0 0 0 1 8.9Z" />
      <path d="M12 16v6M9 18.4l6 3.2M15 18.4l-6 3.2" />
    </>
  ),
  storm: (
    <>
      <path d="M7.5 12.8h9.2a3.6 3.6 0 0 0 0-7.2 5.3 5.3 0 0 0-10.2-1.7 3.9 3.9 0 0 0 1 8.9Z" />
      <path d="M13 15.5l-2.6 4h2.4l-1.4 3.5 3.8-4.6h-2.3l1.3-2.9-1.2 0Z" />
    </>
  ),
};

export function WeatherIcon({ group, className }: { group: WeatherIconGroup; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[group]}
    </svg>
  );
}
