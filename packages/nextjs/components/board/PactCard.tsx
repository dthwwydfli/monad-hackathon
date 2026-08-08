"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { Skeleton } from "~~/components/ui/skeleton";
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

export function PactCard({ pact }: { pact: PactData }) {
  const reduced = useReducedMotion();

  const content = (
    <Card className="mp-card-hover mp-ledger-row transition-all duration-200">
      <CardContent className="p-4">
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
        <Button asChild className="mt-4" variant="secondary">
          <Link href={`/pacts/${pact.id}`}>{boardAction(pact)}</Link>
        </Button>
      </CardContent>
    </Card>
  );

  if (reduced) return content;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      {content}
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
        <p className="font-mono text-xs uppercase tracking-[0.08em]">Example, not live</p>
        <h3 className="mt-3 font-mono text-sm">org/repo/issues/42</h3>
        <p className="mt-2 text-sm">Show confirmed receipt state after a contract write.</p>
        <p className="mt-4 font-mono text-xs">0.25 Testnet MON · OPEN / FUNDED</p>
      </CardContent>
    </Card>
  );
}

export function PreviewPromptCard() {
  return (
    <Card className="border-[var(--action)] bg-[rgba(59,91,219,0.04)]">
      <CardContent className="p-4">
        <p className="font-mono text-xs uppercase tracking-[0.08em]">Board is empty</p>
        <p className="mt-2 text-sm">
          See a realistic walkthrough with mock pacts on the preview page — no fake data here.
        </p>
        <Button asChild className="mt-4" variant="secondary">
          <Link href="/preview">View product preview</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
