"use client";

import { useEffect, useRef } from "react";

interface PrivacyNoticeProps {
  open: boolean;
  onClose: () => void;
  onRevoke: () => void;
  hasConsented: boolean;
}

export function PrivacyNotice({ open, onClose, onRevoke, hasConsented }: PrivacyNoticeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-notice-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-line/20 bg-surface p-7 text-ink shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="privacy-notice-title" className="text-lg font-semibold">
            What this demo panel collects
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 cursor-pointer border border-line/15 px-2 py-1 font-mono text-xs text-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <ul className="mt-5 space-y-4 text-sm text-ink-dim">
          <li>
            <strong className="text-ink">Location.</strong> If you allow it, your browser asks{" "}
            <em>your device</em> for an approximate GPS position. If you decline or it&apos;s
            unavailable, we estimate a coarse location from your public IP address instead. Either
            way, coordinates are sent to our server only to request weather for that spot &mdash;
            they are never written to a database or log file.
          </li>
          <li>
            <strong className="text-ink">IP address.</strong> Used transiently, server-side, only
            to estimate location when GPS isn&apos;t available. It&apos;s shown back to you below (so you can
            see exactly what was used) and is not stored or shared elsewhere.
          </li>
          <li>
            <strong className="text-ink">Name.</strong> Only stored if you type one in, and only in
            your own browser&apos;s local storage &mdash; it never leaves your device.
          </li>
          <li>
            <strong className="text-ink">Theme preference.</strong> Also stored only in your
            browser&apos;s local storage.
          </li>
          <li>
            <strong className="text-ink">Weather data.</strong> Fetched from Open-Meteo, a public
            weather API that does not require or store any personal identifiers.
          </li>
        </ul>

        <p className="mt-5 text-sm text-ink-dim">
          Nothing here is used for advertising, analytics, or shared with third parties beyond the
          weather/IP lookups needed to answer your request. You can withdraw location access at any
          time.
        </p>

        {hasConsented && (
          <button
            onClick={() => {
              onRevoke();
              onClose();
            }}
            className="mt-6 cursor-pointer border border-accent px-4 py-2 font-mono text-xs text-accent-bright transition-colors hover:bg-accent hover:text-on-accent"
          >
            Turn off location &amp; clear this session&apos;s data
          </button>
        )}
      </div>
    </div>
  );
}
