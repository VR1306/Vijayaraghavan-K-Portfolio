"use client";

import { useState } from "react";
import { useActiveSection } from "@/lib/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 border-b border-line/15 bg-surface-deep/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-7">
        <a href="#top" aria-label="Home" className="flex items-center gap-2.5">
          <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6.5 w-6.5">
            <circle cx="13" cy="13" r="11" stroke="var(--accent)" strokeWidth="1.4" />
            <path d="M13 4 L13 9 M13 17 L13 22 M4 13 L9 13 M17 13 L22 13" stroke="var(--line)" strokeWidth="1.2" />
            <circle cx="13" cy="13" r="2.4" fill="var(--accent)" />
          </svg>
          <span className="font-mono text-sm tracking-wide text-ink">VIJAYARAGHAVAN&nbsp;K</span>
        </a>

        <div className="flex items-center gap-5">
          <nav className="hidden gap-7 md:flex">
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

          <ThemeToggle />

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex cursor-pointer h-9 w-9 flex-col items-center justify-center gap-1 border border-line/15 md:hidden"
          >
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col border-b border-line/15 bg-surface-deep md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="border-t border-line/15 px-7 py-3.5 font-mono text-[13px] text-muted"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
