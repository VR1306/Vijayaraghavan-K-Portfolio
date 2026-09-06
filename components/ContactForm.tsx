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

  if (status === "success") {
    return (
      <div className="border border-line/15 px-6 py-6 text-sm text-ink-dim">
        Thanks &mdash; that landed in my inbox. I&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line/15 px-6 py-6 sm:px-7.5">
      <p className="mb-4.5 text-sm text-ink-dim">
        Prefer not to leave the page? Send a note here instead &mdash; it goes straight to my
        inbox, nothing is stored on this site.
      </p>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-mono text-[11px] tracking-wide text-muted">
            NAME
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={80}
            className="mt-1.5 w-full border border-line/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="font-mono text-[11px] tracking-wide text-muted">
            EMAIL
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={120}
            className="mt-1.5 w-full border border-line/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-3.5">
        <label htmlFor="contact-message" className="font-mono text-[11px] tracking-wide text-muted">
          MESSAGE (OPTIONAL)
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          maxLength={1000}
          className="mt-1.5 w-full resize-y border border-line/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
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
        className="mt-4.5 cursor-pointer border border-accent px-5 py-2.5 font-mono text-xs text-accent-bright transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent-bright"
      >
        {status === "submitting" ? "Sending\u2026" : "Send"}
      </button>
    </form>
  );
}
