"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { PhotoCarousel } from "./PhotoCarousel";

const TITLE_BLOCK_FIELDS = [
  { label: "DRAWN BY", value: site.name },
  { label: "BASED IN", value: site.location },
  { label: "STATUS", value: site.status },
  { label: "CONTACT", value: site.phone },
];

// Add more entries here to bring more photos into the rotation.
// `caption` drives the "FIG. 0N — caption" callout under the photo frame.
// Photos are 1024x1536 (2:3) — keep new additions at that ratio so the frame never wobbles.
const PROFILE_PHOTOS = [
  { src: "/vijay-profile-1.jpg", alt: site.name, caption: "Studio portrait" },
  { src: "/vijay-profile-2.png", alt: site.name, caption: "Working session" },
  { src: "/vijay-profile-3.png", alt: site.name, caption: "Conference headshot" },
  { src: "/vijay-profile-4.png", alt: site.name, caption: "Team offsite" },
  { src: "/vijay-profile-5.png", alt: site.name, caption: "Candid, on-site" },
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activePhoto = PROFILE_PHOTOS[activePhotoIndex];
  const figNumber = String(activePhotoIndex + 1).padStart(2, "0");

  return (
    <div className="mx-auto max-w-[1040px] px-7 pt-16">
      <div
        className="relative mb-[70px] p-7 sm:p-12 md:p-16"
        style={{
          textShadow: "0 1px 2px var(--surface), 0 0 22px var(--surface)",
        }}
      >
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
            transition={{
              duration: 1.3,
              ease: [0.3, 0.7, 0.2, 1],
              delay: 0.15,
            }}
          />
        </svg>

        <span className="absolute -right-px -top-px bg-accent px-2.5 py-1 font-mono text-[11px] tracking-wide text-on-accent">
          SHEET A-01
        </span>

        <div className="flex flex-col-reverse gap-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[13px] text-muted">
              A working portfolio, laid out like a set of drawings
            </p>

            <h1 className="mt-2 font-display text-[2.1rem] font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {site.name}
            </h1>

            <p className="mt-3.5 font-mono text-sm text-accent-bright sm:text-base">
              {site.role}
            </p>

            <p className="mt-5 max-w-[56ch] text-base text-ink-dim sm:text-lg">
              {site.tagline} {site.description}
            </p>
          </div>

          <motion.div
            className="relative shrink-0 self-center sm:self-start sm:mt-8 md:mt-10"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.3, 0.7, 0.2, 1], delay: 0.3 }}
          >
            <div className="group relative aspect-[2/3] w-28 overflow-hidden border border-accent bg-surface-deep shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] sm:w-32 md:w-40">
              <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                <PhotoCarousel
                  images={PROFILE_PHOTOS}
                  intervalMs={5000}
                  priority
                  sizes="(min-width: 768px) 160px, (min-width: 640px) 128px, 112px"
                  onIndexChange={setActivePhotoIndex}
                />
              </div>
            </div>
            {/* Corner ticks — a detail-view callout, matching the sheet's drafting-mark language. */}
            <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l-2 border-t-2 border-accent-bright" />
            <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r-2 border-t-2 border-accent-bright" />
            <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-accent-bright" />
            <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-accent-bright" />
            <p className="mt-2 h-4 w-28 overflow-hidden text-ellipsis whitespace-nowrap text-center font-mono text-[10px] tracking-wider text-muted sm:w-32 md:w-40">
              FIG. {figNumber} &mdash; {activePhoto.caption}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3.5">
          <a
            href={`mailto:${site.email}`}
            className="group flex items-center gap-2.5 border border-accent bg-accent/0 px-5 py-3 font-mono text-[13px] tracking-wide text-accent-bright shadow-[0_0_0_0_var(--accent-bright)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-on-accent hover:shadow-[0_8px_24px_-6px_var(--accent-bright)]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-300 group-hover:scale-110"
            >
              <path
                d="M2 4.5h12v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M2.3 4.8 8 9l5.7-4.2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              <dt className="font-mono text-[10.5px] tracking-wider text-muted">
                {field.label}
              </dt>
              <dd className="mt-1.5 text-sm text-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
