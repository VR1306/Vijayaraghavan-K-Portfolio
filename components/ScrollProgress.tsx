"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin copper line under the header that tracks read progress down the
 * page. Uses framer-motion's scroll hooks, which read scroll position off
 * the compositor rather than attaching a manual scroll listener.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-accent"
      aria-hidden="true"
    />
  );
}
