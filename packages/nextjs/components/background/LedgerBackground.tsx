"use client";

import { cn } from "~~/lib/cn";

export function LedgerBackground({ animated = true, className }: { animated?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div
        className={cn("absolute inset-0 mp-gradient-bg", animated && "mp-gradient-animate motion-reduce:animate-none")}
      />
      <div className="absolute inset-0 mp-grid-overlay opacity-40" />
    </div>
  );
}
