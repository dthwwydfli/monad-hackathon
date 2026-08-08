"use client";

import Link from "next/link";
import { DemoBoard, LedgerErrorNotice, PactCard, PactCardSkeleton } from "~~/components/board/PactCard";
import { StatStrip } from "~~/components/board/StatStrip";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { demo } from "~~/config/demo";
import { usePacts } from "~~/hooks/usePacts";
import { PACT_STATE } from "~~/lib/pact";

export function LiveLedger() {
  const { pacts, isLoading, isConfigured, refreshing, error, refetch } = usePacts(demo.landingPreviewCount);
  const preview = pacts.slice(0, demo.landingPreviewCount);

  const counts = {
    open: pacts.filter(p => p.state === PACT_STATE.Open).length,
    claimed: pacts.filter(p => p.state === PACT_STATE.Claimed).length,
    review: pacts.filter(p => p.state === PACT_STATE.Submitted).length,
    released: pacts.filter(p => p.state === PACT_STATE.Released).length,
  };

  // Real data always wins. Sample data only appears when there is genuinely
  // nothing on chain to show, and it is labelled when it does.
  const showDemo = !isConfigured || (!isLoading && preview.length === 0);

  return (
    <section className="border-t border-[var(--rule)] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">The ledger</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Everything is public.</h2>
          </div>
          {refreshing && <span className="text-sm text-[var(--muted-foreground)]">Refreshing ledger…</span>}
        </div>

        <div className="mt-10 space-y-4">
          {error && <LedgerErrorNotice message={error} onRetry={() => void refetch()} />}

          {showDemo ? (
            <DemoBoard limit={4} />
          ) : isLoading ? (
            <>
              <StatStrip counts={{ open: 0, claimed: 0, review: 0, released: 0 }} />
              <div className="grid gap-4 md:grid-cols-2">
                <PactCardSkeleton />
                <PactCardSkeleton />
              </div>
            </>
          ) : (
            <>
              <StatStrip counts={counts} />
              <p className="text-sm text-[var(--muted-foreground)]">{content.showingLatest}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {preview.map(pact => (
                  <PactCard key={pact.id} pact={pact} />
                ))}
              </div>
            </>
          )}
        </div>

        <Button asChild className="mt-8" variant="secondary">
          <Link href="/pacts">Open the full board</Link>
        </Button>
      </div>
    </section>
  );
}
