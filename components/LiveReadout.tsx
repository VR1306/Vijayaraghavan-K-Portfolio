"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useWeatherContext } from "@/lib/WeatherProvider";
import { describeWeatherCode } from "@/lib/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";
import { PrivacyNotice } from "./PrivacyNotice";
import { SectionFrame } from "./SectionFrame";

function formatDay(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

export function LiveReadout() {
  const { consent, setConsent, weather } = useWeatherContext();
  const { value: name, setValue: setName, clear: clearName } = useLocalStorage<string>("visitorName", "");
  const [nameDraft, setNameDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleAllow = () => setConsent("granted");
  const handleDecline = () => setConsent("denied");
  const handleRevoke = () => setConsent("denied");

  const saveName = () => {
    const trimmed = nameDraft.trim().slice(0, 40);
    setName(trimmed);
    setEditingName(false);
  };

  return (
    <section id="live" className="scroll-mt-20 pt-14">
      <SectionFrame
        sheet="SHEET A-02"
        title="A small live demo: local weather, built the privacy-conscious way"
      />

      <div className="border border-line/15 px-6 py-6 sm:px-7.5">
        {/* Personalization row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/15 pb-5">
          {name ? (
            <p className="text-[15px]">
              Hello, <span className="font-semibold text-accent-bright">{name}</span>. Here&rsquo;s
              what it looks like where you are.
            </p>
          ) : editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveName();
              }}
              className="flex flex-wrap items-center gap-2"
            >
              <label htmlFor="visitor-name" className="font-mono text-xs text-muted">
                What should I call you?
              </label>
              <input
                id="visitor-name"
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Your first name"
                maxLength={40}
                className="border border-line/20 bg-transparent px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="cursor-pointer border border-accent px-3 py-1.5 font-mono text-xs text-accent-bright hover:bg-accent hover:text-on-accent"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingName(false)}
                className="font-mono cursor-pointer text-xs text-muted hover:text-ink"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNameDraft("");
                setEditingName(true);
              }}
              className="font-mono cursor-pointer text-xs text-muted underline decoration-line/40 underline-offset-4 hover:text-accent-bright"
            >
              Tell me your name for a personal touch (optional)
            </button>
          )}

          {name && (
            <button
              type="button"
              onClick={() => {
                clearName();
              }}
              className="font-mono cursor-pointer text-[11px] text-muted hover:text-ink"
            >
              Not you? Clear
            </button>
          )}
        </div>

        {/* Consent gate */}
        {consent === "unset" && (
          <div className="mt-5 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[46ch] text-sm text-ink-dim">
              Want a live local weather readout? I&rsquo;ll ask your browser for an approximate
              location (or estimate one from your IP if you say no to that prompt). Nothing is
              stored on any server. This also lets the sky behind the page reflect real conditions
              where you are, instead of just the time of day.
            </p>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                onClick={handleAllow}
                className="cursor-pointer border border-accent px-4 py-2 font-mono text-xs text-accent-bright transition-colors hover:bg-accent hover:text-on-accent"
              >
                Allow
              </button>
              <button
                onClick={handleDecline}
                className="cursor-pointer border border-line/20 px-4 py-2 font-mono text-xs text-muted hover:text-ink"
              >
                Not now
              </button>
              <button
                onClick={() => setPrivacyOpen(true)}
                className="cursor-pointer font-mono text-xs text-muted underline decoration-line/40 underline-offset-4 hover:text-accent-bright"
              >
                Privacy details
              </button>
            </div>
          </div>
        )}

        {consent === "denied" && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-dim">Local weather is off.</p>
            <button
              onClick={handleAllow}
              className="cursor-pointer border border-line/20 px-3.5 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent-bright"
            >
              Enable
            </button>
          </div>
        )}

        {consent === "granted" && (
          <div className="mt-5">
            {(weather.status === "locating" || weather.status === "loading-weather") && (
              <div className="flex items-center gap-3 py-4 text-sm text-muted">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line/30 border-t-accent-bright"
                  aria-hidden="true"
                />
                {weather.status === "locating" ? "Finding your approximate location\u2026" : "Loading local weather\u2026"}
              </div>
            )}

            {weather.status === "error" && (
              <div className="py-3">
                <p className="text-sm text-ink-dim">
                  {weather.error ?? "Something went wrong getting your local weather."}
                </p>
                <button
                  onClick={weather.retry}
                  className="cursor-pointer mt-3 border border-line/20 px-3.5 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent-bright"
                >
                  Try again
                </button>
              </div>
            )}

            {weather.status === "success" && weather.current && (
              <div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3.5 text-accent-bright">
                    <WeatherIcon
                      group={describeWeatherCode(weather.current.code).group}
                      className="h-11 w-11"
                    />
                    <div>
                      <div className="font-mono text-3xl font-semibold text-ink">
                        {Math.round(weather.current.temperatureC)}&deg;C
                      </div>
                      <p className="text-sm text-ink-dim">
                        {describeWeatherCode(weather.current.code).label}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 font-mono text-xs text-muted">
                    <div>
                      <div className="text-ink-dim">HUMIDITY</div>
                      <div className="mt-1 text-ink">{weather.current.humidity}%</div>
                    </div>
                    <div>
                      <div className="text-ink-dim">WIND</div>
                      <div className="mt-1 text-ink">{Math.round(weather.current.windKph)} km/h</div>
                    </div>
                  </div>
                </div>

                {weather.forecast.length > 0 && (
                  <div className="mt-6 grid grid-cols-4 gap-px border border-line/15 bg-line/15">
                    {weather.forecast.map((day) => (
                      <div key={day.date} className="bg-surface px-2 py-3.5 text-center">
                        <div className="font-mono text-[11px] text-muted">{formatDay(day.date)}</div>
                        <WeatherIcon
                          group={describeWeatherCode(day.code).group}
                          className="mx-auto mt-2 h-5 w-5 text-accent-bright"
                        />
                        <div className="mt-2 font-mono text-xs text-ink">
                          {Math.round(day.maxC)}&deg;/{Math.round(day.minC)}&deg;
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line/15 pt-3.5 font-mono text-[11px] text-muted">
                  <span>
                    {weather.location?.source === "gps"
                      ? "Location: device GPS (approximate)"
                      : `Location: estimated from IP${weather.location?.city ? ` \u2014 ${weather.location.city}, ${weather.location.country}` : ""}`}
                    {weather.location?.ip ? ` (${weather.location.ip})` : ""}
                  </span>
                  <span className="flex gap-4">
                    <button onClick={() => setPrivacyOpen(true)} className="cursor-pointer underline decoration-line/40 underline-offset-4 hover:text-accent-bright">
                      Privacy details
                    </button>
                    <button onClick={handleRevoke} className="cursor-pointer underline decoration-line/40 underline-offset-4 hover:text-accent-bright">
                      Turn off
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <PrivacyNotice
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        onRevoke={handleRevoke}
        hasConsented={consent === "granted"}
      />
    </section>
  );
}
