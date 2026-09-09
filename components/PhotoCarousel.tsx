"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface Photo {
  src: string;
  alt: string;
}

interface PhotoCarouselProps {
  images: Photo[];
  intervalMs?: number;
  sizes: string;
  priority?: boolean;
  onIndexChange?: (index: number) => void;
}

/**
 * Cycles through a set of photos on a timer, crossfading between them.
 * Pauses while the tab isn't visible (no point animating off-screen), and
 * collapses to an instant swap under prefers-reduced-motion.
 */
export function PhotoCarousel({ images, intervalMs = 5000, sizes, priority, onIndexChange }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        setIndex((i) => (i + 1) % images.length);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  const current = images[index];

  return (
    <div className="relative h-full w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={current.src}
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeInOut" }}
        >
          <Image src={current.src} alt={current.alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
