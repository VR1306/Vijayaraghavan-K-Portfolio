"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Themed tooltip — a small drafting-note callout (accent border, surface-deep
 * fill, font-mono) that opens on hover or keyboard focus above the trigger.
 */
export function Tooltip({ label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const tooltipId = useId();

  return (
    <span
      className="relative inline-block"
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? tooltipId : undefined}
    >
      {/* `block` so width/overflow (e.g. ellipsis truncation) from `className` actually take effect —
          a plain inline span ignores width/height entirely. Kept separate from the tooltip's own
          positioning box so this element's overflow-hidden never clips the tooltip below. */}
      <span className={`block ${className ?? ""}`}>{children}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 border border-accent bg-surface-deep px-2.5 py-1.5 text-center font-mono text-[10.5px] leading-snug tracking-wide text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]"
          >
            {label}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-accent bg-surface-deep" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
