"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DemoBoard, LedgerErrorNotice, PactCard, PactCardSkeleton } from "~~/components/board/PactCard";
import { Button } from "~~/components/ui/button";
import { usePacts } from "~~/hooks/usePacts";
import { cn } from "~~/lib/cn";
import { PACT_STATE, PactData, PactStateValue } from "~~/lib/pact";

type FilterKey = "Open" | "Claimed" | "Awaiting review" | "Released" | "All";

const FILTERS: FilterKey[] = ["Open", "Claimed", "Awaiting review", "Released", "All"];

const FILTER_STATE: Partial<Record<FilterKey, PactStateValue>> = {
  Open: PACT_STATE.Open,
  Claimed: PACT_STATE.Claimed,
  "Awaiting review": PACT_STATE.Submitted,
  Released: PACT_STATE.Released,
};

function matchesFilter(state: PactStateValue, filter: FilterKey) {
  if (filter === "All") return true;
  return state === FILTER_STATE[filter];
}

function countFor(pacts: PactData[], filter: FilterKey) {
  if (filter === "All") return pacts.length;
  return pacts.filter(p => matchesFilter(p.state, filter)).length;
}

export default function PactsPage() {
  const [filter, setFilter] = useState<FilterKey>("Open");
  const { pacts, isLoading, isConfigured, refreshing, error, refetch } = usePacts();

  const filtered = useMemo(() => pacts.filter(p => matchesFilter(p.state, filter)), [filter, pacts]);

  const showDemo = !isConfigured || (!isLoading && pacts.length === 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Public commit board</h1>
          {/* Orientation before interaction: the board can't tell which side you're on. */}
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            Looking for work? Every <strong className="font-semibold">Open</strong> commit already has its bounty locked
            in the contract. Funding an issue instead?{" "}
            <Link className="link text-[var(--action)]" href="/create">
              Fund an issue
            </Link>
            .
          </p>
        </div>
        {refreshing && <span className="text-sm text-[var(--muted-foreground)]">Refreshing ledger…</span>}
      </div>

      {/* Segmented control, matching the header's pill rail rather than inventing a second language. */}
      <div
        aria-label="Filter commits by state"
        className="mt-8 inline-flex flex-wrap gap-0.5 rounded-full border border-[var(--rule)] bg-[var(--surface)] p-1"
        role="group"
      >
        {FILTERS.map(item => {
          const active = filter === item;
          const count = countFor(pacts, item);
          return (
            <button
              aria-pressed={active}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors duration-200",
                active
                  ? "bg-[var(--action)] text-[var(--on-dark)]"
                  : "text-[var(--ink)]/60 hover:bg-[var(--surface)] hover:text-[var(--ink)]",
              )}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
              {!showDemo && (
                <span className={cn("tabular-nums", active ? "text-[var(--on-dark)]/70" : "text-[var(--ink)]/40")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {error && <LedgerErrorNotice message={error} onRetry={() => void refetch()} />}

        {showDemo ? (
          <DemoBoard />
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <PactCardSkeleton />
            <PactCardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--rule)] p-10 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">No commits are {filter.toLowerCase()} right now.</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link href="/create">Fund an issue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(pact => (
              <PactCard key={pact.id} pact={pact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
