"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";
import type { Metric } from "@/data/experience";

export function MetricCounter({ value, prefix = "", suffix = "", label }: Metric) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync display to final value once we know motion is disabled
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, shouldReduceMotion]);

  return (
    <div ref={ref} className="border border-line/15 px-5 py-6">
      <div className="font-mono text-[1.9rem] font-semibold text-accent-bright sm:text-[2.2rem]">
        {prefix}
        {display}
        {suffix}
      </div>
      <p className="mt-1.5 text-[13px] text-ink-dim">{label}</p>
    </div>
  );
}
