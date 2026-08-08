"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "~~/components/ui/badge";
import { cn } from "~~/lib/cn";
import { PACT_STATE, PactStateValue, STATUS_LABELS } from "~~/lib/pact";

const BADGE_VARIANT: Record<PactStateValue, "open" | "claimed" | "submitted" | "released" | "neutral"> = {
  [PACT_STATE.Open]: "open",
  [PACT_STATE.Claimed]: "claimed",
  [PACT_STATE.Submitted]: "submitted",
  [PACT_STATE.Released]: "released",
  [PACT_STATE.Cancelled]: "neutral",
  [PACT_STATE.Reclaimed]: "neutral",
};

export function PactStatusStamp({ state, large = false }: { state: PactStateValue; large?: boolean }) {
  const { label } = STATUS_LABELS[state];
  const isReleased = state === PACT_STATE.Released;
  const reduced = useReducedMotion();

  const badge = (
    <Badge
      aria-label={`Pact status: ${label}`}
      className={cn(large && "text-sm px-4 py-1.5")}
      variant={BADGE_VARIANT[state]}
    >
      {label}
    </Badge>
  );

  if (!isReleased || reduced) return badge;

  return (
    <motion.span
      animate={{ scale: [1, 1.06, 1] }}
      className="inline-flex"
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {badge}
    </motion.span>
  );
}
