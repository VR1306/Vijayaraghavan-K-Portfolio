"use client";

import { useState, useRef, useEffect } from "react";
import { useCursor, CURSOR_STYLES, CursorStyle } from "@/lib/CursorContext";
import { motion, useReducedMotion } from "framer-motion";

export function CursorToggle() {
  const { enabled, toggleEnabled, isTouch, cursorStyle, setCursorStyle } = useCursor();
  const shouldReduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isTouch) return null;

  const currentStyleObj =
    CURSOR_STYLES.find((s) => s.id === cursorStyle) || CURSOR_STYLES[0];

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Main 3D On/Off Toggle Button */}
      <button
        type="button"
        onClick={toggleEnabled}
        aria-label={
          enabled ? "Disable 3D cursor (shortcut: C)" : "Enable 3D cursor (shortcut: C)"
        }
        title={
          enabled
            ? "3D Cursor Active [Press C to toggle]"
            : "3D Cursor Inactive [Press C to toggle]"
        }
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

        <span className="font-mono text-[11px] font-medium tracking-wider">
          3D
        </span>

        {/* Tiny active status dot */}
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            enabled
              ? "bg-accent-bright shadow-[0_0_6px_var(--accent-bright)]"
              : "bg-muted/40"
          }`}
        />
      </button>

      {/* Style Selector Dropdown Trigger (visible when enabled) */}
      {enabled && (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={`Select cursor design: ${currentStyleObj.label} (shortcut: X)`}
            title="Choose 3D Cursor Design [Press X to cycle]"
            aria-expanded={menuOpen}
            className="flex h-9 items-center gap-1 border-y border-r border-accent/80 bg-accent/5 px-2 font-mono text-[11px] text-accent-bright transition-colors hover:bg-accent/10 cursor-pointer"
          >
            <span>{currentStyleObj.icon}</span>
            <span className="hidden lg:inline">{currentStyleObj.label}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            >
              <path d="M2 3.5L5 6.5L8 3.5" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-11 z-[100] w-64 border border-line/20 bg-surface-deep/95 p-1.5 font-mono shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-line/15 px-2 py-1.5 text-[10px] text-muted uppercase tracking-wider">
                <span>3D Cursor Designs</span>
                <span className="text-accent-bright">Press X to cycle</span>
              </div>
              <div className="mt-1 flex flex-col gap-1">
                {CURSOR_STYLES.map((style) => {
                  const isSelected = style.id === cursorStyle;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setCursorStyle(style.id);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-start gap-2.5 px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "border border-accent/60 bg-accent/10 text-accent-bright font-medium"
                          : "border border-transparent text-ink hover:border-line/20 hover:bg-surface/60"
                      }`}
                    >
                      <span className="text-sm mt-0.5">{style.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{style.label}</span>
                          {isSelected && (
                            <span className="text-[10px] text-accent-bright font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[10.5px] leading-tight text-ink-dim">
                          {style.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
