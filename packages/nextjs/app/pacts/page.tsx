"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExamplePactCard, PactCard, PactCardSkeleton, PreviewPromptCard } from "~~/components/board/PactCard";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { usePacts } from "~~/hooks/usePacts";
import { cn } from "~~/lib/cn";
import { PACT_STATE, PactStateValue } from "~~/lib/pact";

type FilterKey = "Open" | "Claimed" | "Awaiting review" | "Released" | "All";

const FILTERS: FilterKey[] = ["Open", "Claimed", "Awaiting review", "Released", "All"];

function matchesFilter(state: PactStateValue, filter: FilterKey) {
  if (filter === "All") return true;
  if (filter === "Open") return state === PACT_STATE.Open;
  if (filter === "Claimed") return state === PACT_STATE.Claimed;
  if (filter === "Awaiting review") return state === PACT_STATE.Submitted;
  if (filter === "Released") return state === PACT_STATE.Released;
  return true;
}

export default function PactsPage() {
  const [filter, setFilter] = useState<FilterKey>("Open");
  const { pacts, isLoading, isConfigured, refreshing } = usePacts();

  const filtered = useMemo(
    () =>
      pacts.filter(p => {
        if (filter === "All") return true;
        return matchesFilter(p.state, filter);
      }),
    [filter, pacts],
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Public pact board</h1>
          <p className="mt-2 text-sm">{content.showingLatest}</p>
        </div>
        {refreshing && <span className="text-sm">Refreshing ledger…</span>}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map(item => (
          <button
            className={cn(
              "min-h-12 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors",
              filter === item
                ? "border-[var(--action)] bg-[var(--action)] text-white"
                : "border-[var(--rule)] hover:border-[var(--action)]",
            )}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {!isConfigured ? (
          <div className="space-y-4 md:col-span-2">
            <ExamplePactCard />
            <PreviewPromptCard />
          </div>
        ) : isLoading ? (
          <>
            <PactCardSkeleton />
            <PactCardSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="space-y-4 md:col-span-2">
            <PreviewPromptCard />
            <Button asChild>
              <Link href="/create">Fund a pact</Link>
            </Button>
          </div>
        ) : (
          filtered.map(pact => <PactCard key={pact.id} pact={pact} />)
        )}
      </div>
    </div>
  );
}
