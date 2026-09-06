"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * A useState-like hook that persists to localStorage. Safe for SSR: the
 * initial render always uses `initialValue` (server and client must match
 * on first paint), then syncs from storage after mount.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage into React state on mount
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // Storage unavailable (private browsing, disabled, etc.) — fall back
      // to the in-memory default for this session.
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Ignore write failures; state still updates for this session.
        }
        return resolved;
      });
    },
    [key]
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
    setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, setValue: update, clear, hydrated } as const;
}
