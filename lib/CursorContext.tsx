"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface CursorContextType {
  enabled: boolean;
  setEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleEnabled: () => void;
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
  hoverText: null,
  setHoverText: () => {},
  isTouch: false,
  cursorMode: "gyro",
  setCursorMode: () => {},
});

export const CURSOR_STORAGE_KEY = "portfolio_3d_cursor_enabled";
export const CURSOR_MODE_KEY = "portfolio_3d_cursor_mode";

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const { value: storedEnabled, setValue: setStoredEnabled, hydrated } =
    useLocalStorage<boolean>(CURSOR_STORAGE_KEY, true);
  const { value: storedMode, setValue: setStoredMode } =
    useLocalStorage<"gyro" | "minimal">(CURSOR_MODE_KEY, "gyro");

  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

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

  // Global keyboard shortcut: Press 'C' to toggle 3D cursor (when not in inputs/textareas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (
        e.key.toLowerCase() === "c" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isInput
      ) {
        toggleEnabled();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleEnabled]);

  return (
    <CursorContext.Provider
      value={{
        enabled,
        setEnabled: setStoredEnabled,
        toggleEnabled,
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
