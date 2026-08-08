"use client";

import { NumberTicker } from "~~/components/ui/number-ticker";
import { cn } from "~~/lib/cn";

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
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{label}</p>
          {/*
            NumberTicker holds at its start value until it scrolls into view and
            respects reduced-motion through framer-motion's own gate, so the
            static branch only needs to skip the animation entirely.
          */}
          {animated ? (
            <NumberTicker className="text-3xl font-medium" value={value} />
          ) : (
            <p className="text-3xl font-medium tabular-nums">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
