"use client";

import { CSSProperties } from "react";
import { Transition, motion } from "framer-motion";
import { cn } from "~~/lib/cn";

/**
 * Magic UI BorderBeam. Upstream imports from `motion/react`; framer-motion
 * exposes the same `motion` factory. Default colours are ours, not Magic UI's
 * orange/violet pair.
 */
interface BorderBeamProps {
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  style?: CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
}

export function BorderBeam({
  className,
  size = 60,
  delay = 0,
  duration = 8,
  colorFrom = "#0a9396",
  colorTo = "#94d2bd",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
}: BorderBeamProps) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn(
          "absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as CSSProperties
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
}
