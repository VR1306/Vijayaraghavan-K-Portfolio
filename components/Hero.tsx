"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

const TITLE_BLOCK_FIELDS = [
  { label: "DRAWN BY", value: site.name },
  { label: "BASED IN", value: site.location },
  { label: "STATUS", value: site.status },
  { label: "CONTACT", value: site.phone },
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-[1040px] px-7 pt-16">
      <div className="relative mb-[70px] p-7 sm:p-12 md:p-16">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <motion.rect
            x={0.4}
            y={0.4}
            width={99.2}
            height={99.2}
            pathLength={100}
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeDasharray={100}
            initial={{ strokeDashoffset: shouldReduceMotion ? 0 : 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.3, ease: [0.3, 0.7, 0.2, 1], delay: 0.15 }}
          />
        </svg>

        <span className="absolute -right-px -top-px bg-accent px-2.5 py-1 font-mono text-[11px] tracking-wide text-on-accent">
          SHEET A-01
        </span>

        <p className="font-mono text-[13px] text-muted">
          A working portfolio, laid out like a set of drawings
        </p>

        <h1 className="mt-2 text-[2rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl md:text-7xl">
          {site.name}
        </h1>

        <p className="mt-3.5 font-mono text-sm text-accent-bright sm:text-base">{site.role}</p>

        <p className="mt-5 max-w-[56ch] text-base text-ink-dim sm:text-lg">
          {site.tagline} {site.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3.5">
          <a
            href={`mailto:${site.email}`}
            className="border border-accent px-5 py-3 font-mono text-[13px] tracking-wide transition-colors hover:bg-accent hover:text-on-accent"
          >
            Email me
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line/20 px-5 py-3 font-mono text-[13px] tracking-wide text-muted transition-colors hover:border-muted hover:text-ink"
          >
            Connect on LinkedIn
          </a>
          <a
            href={site.resumeHref}
            download
            className="border border-line/20 px-5 py-3 font-mono text-[13px] tracking-wide text-muted transition-colors hover:border-muted hover:text-ink"
          >
            Download r&eacute;sum&eacute;
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-2 border-t border-line/15 sm:grid-cols-4">
          {TITLE_BLOCK_FIELDS.map((field, i) => (
            <div
              key={field.label}
              className={`px-0 pt-4 sm:px-4.5 ${
                i > 0 ? "sm:border-l sm:border-line/15" : ""
              } ${i % 2 === 0 ? "pr-4" : "pl-4 sm:pl-4.5"}`}
            >
              <dt className="font-mono text-[10.5px] tracking-wider text-muted">{field.label}</dt>
              <dd className="mt-1.5 text-sm text-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
