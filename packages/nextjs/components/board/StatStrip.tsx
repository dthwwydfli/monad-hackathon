"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~~/lib/cn";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 800;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.round(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, reduced]);

  return (
    <div ref={ref}>
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{label}</p>
      <p className="text-3xl font-semibold tabular-nums">{display}</p>
    </div>
  );
}

export function StatStrip({
  counts,
  animated = false,
  className,
}: {
  counts: { open: number; claimed: number; review: number; released: number };
  animated?: boolean;
  className?: string;
}) {
  const items = [
    { label: "Open", value: counts.open },
    { label: "Claimed", value: counts.claimed },
    { label: "Awaiting review", value: counts.review },
    { label: "Released", value: counts.released },
  ];

  return (
    <div className={cn("mp-card grid grid-cols-2 gap-4 p-4 sm:grid-cols-4", className)}>
      {items.map(({ label, value }) =>
        animated ? (
          <AnimatedCounter key={label} label={label} value={value} />
        ) : (
          <div key={label}>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{label}</p>
            <p className="text-3xl font-semibold tabular-nums">{value}</p>
          </div>
        ),
      )}
    </div>
  );
}
