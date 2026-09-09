"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { THEME_MANUAL_KEY } from "./ThemeAutoSync";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Avoid rendering theme-dependent UI until mounted, since the server
  // can't know the user's stored preference (prevents hydration mismatch).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes mount-detection pattern
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleClick = () => {
    try {
      window.localStorage.setItem(THEME_MANUAL_KEY, "true");
    } catch {
      // Storage unavailable — the toggle still works for this session.
    }
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden border border-line/15 text-ink transition-colors duration-300 hover:border-accent hover:text-accent-bright"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={isDark ? "dark" : "light"}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.35, ease: [0.3, 0.7, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 1v2M8 13v2M2.6 2.6l1.4 1.4M12 12l1.4 1.4M1 8h2M13 8h2M2.6 13.4L4 12M12 4l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.span>
        ) : (
          <span className="h-4 w-4" />
        )}
      </AnimatePresence>
    </button>
  );
}
