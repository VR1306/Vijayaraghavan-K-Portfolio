"use client";

import { useState } from "react";
import { useActiveSection } from "@/lib/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";
import { CursorToggle } from "./CursorToggle";

const NAV_ITEMS = [
  { id: "live", label: "Live" },
  { id: "systems", label: "Systems" },
  { id: "built", label: "Built" },
  { id: "record", label: "Track record" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  return (
    <header className="sticky top-0 z-50 border-b border-line/15 bg-surface-deep/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-4 sm:px-6 md:px-7">
        <a href="#top" aria-label="Home" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-6.5 sm:w-6.5 shrink-0">
            <circle cx="13" cy="13" r="11" stroke="var(--accent)" strokeWidth="1.4" />
            <path d="M13 4 L13 9 M13 17 L13 22 M4 13 L9 13 M17 13 L22 13" stroke="var(--line)" strokeWidth="1.2" />
            <circle cx="13" cy="13" r="2.4" fill="var(--accent)" />
          </svg>
          <span className="font-mono text-xs sm:text-sm tracking-wide text-ink truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
            VIJAYARAGHAVAN&nbsp;K
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3.5 md:gap-5 shrink-0">
          <nav className="hidden gap-6 lg:gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`border-b font-mono text-[13px] transition-colors ${
                  activeId === item.id
                    ? "border-accent text-accent-bright"
                    : "border-transparent text-muted hover:text-accent-bright"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3D Cursor Toggle: Desktop/Tablet fine-pointer device feature */}
          <div className="hidden sm:flex items-center">
            <CursorToggle />
          </div>

          <ThemeToggle />

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex cursor-pointer h-10 w-10 sm:h-9 sm:w-9 flex-col items-center justify-center gap-1.5 border border-line/20 bg-surface/50 transition-colors hover:border-accent hover:text-accent-bright md:hidden"
          >
            <span
              className={`block h-0.5 w-4 bg-ink transition-transform duration-200 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-ink transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-ink transition-transform duration-200 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col border-b border-line/15 bg-surface-deep/98 shadow-2xl backdrop-blur-lg md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className={`border-t border-line/10 px-5 py-3.5 font-mono text-[13px] transition-colors ${
                activeId === item.id
                  ? "border-l-2 border-l-accent bg-accent/5 text-accent-bright font-medium"
                  : "text-muted hover:bg-surface/50 hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}

          {/* Mobile drawer quick actions */}
          <div className="flex items-center justify-between border-t border-line/15 bg-surface px-5 py-3 text-xs font-mono text-muted">
            <span className="text-[11px]">3D Cursor (desktop mouse)</span>
            <div className="sm:hidden">
              <CursorToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
