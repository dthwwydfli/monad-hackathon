"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { Skeleton } from "~~/components/ui/skeleton";
import { content } from "~~/config/content";
import { DEMO_PACTS } from "~~/config/demoPacts";
import { cn } from "~~/lib/cn";
import { formatDeadline, formatMon, shortenAddress } from "~~/lib/format";
import { PACT_STATE, PactData } from "~~/lib/pact";
import { parseIssuePath } from "~~/lib/validation";

function boardAction(pact: PactData) {
  switch (pact.state) {
    case PACT_STATE.Submitted:
      return "View proof";
    case PACT_STATE.Released:
      return "View receipt";
    case PACT_STATE.Cancelled:
    case PACT_STATE.Reclaimed:
      return "View record";
    default:
      return "View pact";
  }
}

/**
 * `demo` renders the card from illustrative data. It must stay visually
 * distinct and must not link into /pacts/[id], which reads the chain and would
 * 404 on an id that only exists in the sample set.
 */
export function PactCard({ pact, demo = false }: { pact: PactData; demo?: boolean }) {
  const reduced = useReducedMotion();

  const card = (
    <Card className={cn("transition-all duration-200", demo ? "border-dashed" : "mp-card-hover")}>
      <CardContent className="p-4">
        {demo && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--review)]">
            Example — not live
          </p>
        )}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <PactStatusStamp state={pact.state} />
          <p className="font-mono text-xs">{formatMon(pact.bountyWei)} Testnet MON</p>
        </div>
        <h3 className="mt-3 font-mono text-sm">{parseIssuePath(pact.issueUrl)}</h3>
        <p className="mt-2 line-clamp-2 text-sm">{pact.acceptance}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span>Claim by {formatDeadline(pact.claimDeadline)}</span>
          <span>Maintainer {shortenAddress(pact.maintainer)}</span>
        </div>
        {!demo && (
          <Button asChild className="mt-4" variant="secondary">
            <Link href={`/pacts/${pact.id}`}>{boardAction(pact)}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (reduced || demo) return card;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      {card}
    </motion.div>
  );
}

export function PactCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

export function ExamplePactCard() {
  return (
    <Card className="border-dashed opacity-80">
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-[0.14em]">Example, not live</p>
        <h3 className="mt-3 font-mono text-sm">org/repo/issues/42</h3>
        <p className="mt-2 text-sm">Show confirmed receipt state after a contract write.</p>
        <p className="mt-4 font-mono text-xs">0.25 Testnet MON · OPEN / FUNDED</p>
      </CardContent>
    </Card>
  );
}

/**
 * Shown in place of the live ledger when the contract is unconfigured or the
 * board is genuinely empty. Replaces the old PreviewPromptCard, which sent the
 * reader off to a mockup and taught them the product does not work.
 */
export function DemoBoard({ limit, className }: { limit?: number; className?: string }) {
  const pacts = limit ? DEMO_PACTS.slice(0, limit) : DEMO_PACTS;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--review)] bg-[rgba(238,155,0,0.14)] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--review)]">
          Example ledger — not live
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          {content.emptyBoard} These cards show what the board looks like in use.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {pacts.map(pact => (
          <PactCard demo key={pact.id} pact={pact} />
        ))}
      </div>
    </div>
  );
}

/** Non-blocking notice that the chain read failed; the stale board stays visible. */
export function LedgerErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--danger)] bg-[rgba(180,35,24,0.06)] px-4 py-3"
      role="alert"
    >
      <p className="text-sm text-[var(--danger)]">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" type="button" variant="secondary">
          Try again
        </Button>
      )}
    </div>
  );
}
