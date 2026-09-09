"use client";

import { useState } from "react";
import { site } from "@/data/site";

type Status = "idle" | "submitting" | "success" | "error";

const NOT_CONFIGURED = site.formspreeEndpoint.includes("YOUR_FORM_ID");

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (NOT_CONFIGURED) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const body = await res.json().catch(() => null);
        setErrorMessage(body?.error ?? "Something went wrong sending that. Try again?");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const fieldClasses =
    "mt-1.5 w-full border border-line/25 bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-bright)_28%,transparent)]";

  if (status === "success") {
    return (
      <div className="relative border border-line/20 bg-surface-deep/70 px-6 py-8 text-center shadow-[0_20px_50px_-28px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:px-8">
        <p className="font-display text-lg font-bold text-ink">Message sent</p>
        <p className="mt-1.5 text-sm text-ink-dim">
          Thanks &mdash; that landed in my inbox. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border border-line/20 bg-surface-deep/90 px-6 py-7 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:px-8 sm:py-8"
    >
      <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l-2 border-t-2 border-accent-bright" />
      <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r-2 border-t-2 border-accent-bright" />
      <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-accent-bright" />
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-accent-bright" />

      <p className="mb-5 text-sm text-ink-dim">
        Prefer not to leave the page? Send a note here instead &mdash; it goes straight to my
        inbox, nothing is stored on this site.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label
            htmlFor="contact-name"
            className="font-mono text-[11px] tracking-wide text-muted transition-colors group-focus-within:text-accent-bright"
          >
            NAME
          </label>
          <input id="contact-name" name="name" type="text" required maxLength={80} className={fieldClasses} />
        </div>
        <div className="group">
          <label
            htmlFor="contact-email"
            className="font-mono text-[11px] tracking-wide text-muted transition-colors group-focus-within:text-accent-bright"
          >
            EMAIL
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={120} className={fieldClasses} />
        </div>
      </div>

      <div className="group mt-4">
        <label
          htmlFor="contact-message"
          className="font-mono text-[11px] tracking-wide text-muted transition-colors group-focus-within:text-accent-bright"
        >
          MESSAGE (OPTIONAL)
        </label>
        <textarea id="contact-message" name="message" rows={3} maxLength={1000} className={`${fieldClasses} resize-y`} />
      </div>

      {NOT_CONFIGURED && (
        <p className="mt-3.5 text-xs text-accent-bright">
          Form isn&apos;t wired up yet &mdash; add a Formspree endpoint in{" "}
          <code className="font-mono">data/site.ts</code> to enable this.
        </p>
      )}

      {status === "error" && errorMessage && (
        <p className="mt-3.5 text-xs text-accent-bright">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || NOT_CONFIGURED}
        className="group mt-5 flex cursor-pointer items-center gap-2.5 border border-accent px-5 py-2.5 font-mono text-xs tracking-wide text-accent-bright shadow-[0_0_0_0_var(--accent-bright)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-on-accent hover:shadow-[0_8px_24px_-6px_var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-transparent disabled:hover:text-accent-bright disabled:hover:shadow-none"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {status === "submitting" ? "Sending\u2026" : "Send"}
      </button>
    </form>
  );
}
