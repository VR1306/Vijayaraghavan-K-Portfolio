"use client";

import { useCursor } from "@/lib/CursorContext";
import { motion, useReducedMotion } from "framer-motion";

export function CursorToggle() {
  const { enabled, toggleEnabled, isTouch } = useCursor();
  const shouldReduceMotion = useReducedMotion();

  // If the visitor is on a touch device, hide the cursor toggle
  if (isTouch) return null;

  return (
    <button
      type="button"
      onClick={toggleEnabled}
      aria-label={enabled ? "Disable 3D cursor (shortcut: C)" : "Enable 3D cursor (shortcut: C)"}
      title={enabled ? "3D Cursor Active [Press C to toggle]" : "3D Cursor Inactive [Press C to toggle]"}
      className={`group relative flex h-9 items-center gap-1.5 border px-2.5 font-mono text-xs transition-colors duration-300 cursor-pointer ${
        enabled
          ? "border-accent/80 text-accent-bright bg-accent/5 hover:border-accent hover:bg-accent/10"
          : "border-line/15 text-muted hover:border-line/40 hover:text-ink"
      }`}
    >
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        animate={
          enabled && !shouldReduceMotion
            ? { rotate: [0, 360] }
            : { rotate: 0 }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Isometric 3D Cube / Precision drafting reticle */}
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </motion.svg>

      <span className="hidden sm:inline font-mono text-[11px] font-medium tracking-wider">
        3D
      </span>

      {/* Tiny active status dot */}
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
          enabled ? "bg-accent-bright shadow-[0_0_6px_var(--accent-bright)]" : "bg-muted/40"
        }`}
      />
    </button>
  );
}
