"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type CursorStyle = "tourbillon" | "compass" | "tesseract" | "prism";

export interface CursorContextType {
  enabled: boolean;
  setEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleEnabled: () => void;
  cursorStyle: CursorStyle;
  setCursorStyle: (style: CursorStyle) => void;
  cycleCursorStyle: () => void;
  hoverText: string | null;
  setHoverText: (text: string | null) => void;
  isTouch: boolean;
  cursorMode: "gyro" | "minimal";
  setCursorMode: (mode: "gyro" | "minimal") => void;
}

const CursorContext = createContext<CursorContextType>({
  enabled: true,
  setEnabled: () => {},
  toggleEnabled: () => {},
  cursorStyle: "tourbillon",
  setCursorStyle: () => {},
  cycleCursorStyle: () => {},
  hoverText: null,
  setHoverText: () => {},
  isTouch: false,
  cursorMode: "gyro",
  setCursorMode: () => {},
});

export const CURSOR_STORAGE_KEY = "portfolio_3d_cursor_enabled";
export const CURSOR_MODE_KEY = "portfolio_3d_cursor_mode";
export const CURSOR_STYLE_KEY = "portfolio_3d_cursor_style";

export const CURSOR_STYLES: { id: CursorStyle; label: string; icon: string; description: string }[] = [
  {
    id: "tourbillon",
    label: "Tourbillon",
    icon: "⚙",
    description: "Royal Horology Chronometer with dual balance rings & sapphire pivot",
  },
  {
    id: "compass",
    label: "Compass",
    icon: "📐",
    description: "Architectural Caliper with knurled adjustment thumbwheel & vernier scale",
  },
  {
    id: "tesseract",
    label: "Tesseract",
    icon: "💠",
    description: "Quantum 4D Hypercube with pulsating vertex nodes and dynamic rotation",
  },
  {
    id: "prism",
    label: "Prism",
    icon: "💎",
    description: "Minimalist Imperial Crystal with velocity-responsive aerodynamic banking",
  },
];

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const { value: storedEnabled, setValue: setStoredEnabled, hydrated } =
    useLocalStorage<boolean>(CURSOR_STORAGE_KEY, true);
  const { value: storedMode, setValue: setStoredMode } =
    useLocalStorage<"gyro" | "minimal">(CURSOR_MODE_KEY, "gyro");
  const { value: storedStyle, setValue: setStoredStyle } =
    useLocalStorage<CursorStyle>(CURSOR_STYLE_KEY, "tourbillon");

  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  const STYLES: CursorStyle[] = ["tourbillon", "compass", "tesseract", "prism"];
  const cursorStyle: CursorStyle = STYLES.includes(storedStyle as CursorStyle)
    ? (storedStyle as CursorStyle)
    : "tourbillon";

  const cycleCursorStyle = useCallback(() => {
    setStoredStyle((curr) => {
      const idx = STYLES.indexOf((curr as CursorStyle) || "tourbillon");
      return STYLES[(idx + 1) % STYLES.length];
    });
  }, [setStoredStyle]);

  useEffect(() => {
    const checkTouch = () => {
      if (typeof window === "undefined") return;
      const hasCoarse =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(pointer: coarse)").matches
          : false;
      const hasTouch =
        "ontouchstart" in window ||
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
      setIsTouch(Boolean(hasCoarse && hasTouch));
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  const enabled = hydrated && !isTouch && storedEnabled;

  const toggleEnabled = useCallback(() => {
    setStoredEnabled((prev) => !prev);
  }, [setStoredEnabled]);

  // Global keyboard shortcuts:
  // 'C' to toggle 3D cursor on/off
  // 'X' to cycle 3D cursor style
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.ctrlKey || e.metaKey || e.altKey || isInput) return;

      if (e.key.toLowerCase() === "c") {
        toggleEnabled();
      } else if (e.key.toLowerCase() === "x" && enabled) {
        cycleCursorStyle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleEnabled, cycleCursorStyle, enabled]);

  return (
    <CursorContext.Provider
      value={{
        enabled,
        setEnabled: setStoredEnabled,
        toggleEnabled,
        cursorStyle,
        setCursorStyle: setStoredStyle,
        cycleCursorStyle,
        hoverText,
        setHoverText,
        isTouch,
        cursorMode: storedMode || "gyro",
        setCursorMode: setStoredMode,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
