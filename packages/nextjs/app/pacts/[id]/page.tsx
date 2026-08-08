"use client";

import { use } from "react";
import Link from "next/link";
import { LedgerDisclosure, PactSummary } from "~~/components/pact/PactSummary";
import { RoleActionPanel } from "~~/components/pact/RoleActionPanel";
import { Button } from "~~/components/ui/button";
import { Skeleton } from "~~/components/ui/skeleton";
import { content } from "~~/config/content";
import { usePact } from "~~/hooks/usePact";

export default function PactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pactId = Number(id);
  const { pact, isLoading, notFound, error, refetch, isConfigured } = usePact(pactId);

  if (!isConfigured) {
    return (
      <div>
        <p>{content.ledgerNotConfigured}</p>
        <Link className="link mt-4 inline-block" href="/pacts">
          Back to board
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-medium">Can&apos;t reach Monad Testnet.</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{error}</p>
        <Button className="mt-4" onClick={() => void refetch()} type="button" variant="secondary">
          Try again
        </Button>
      </div>
    );
  }

  if (notFound || !pact) {
    return (
      <div>
        <h1 className="text-2xl font-medium">This commit does not exist.</h1>
        <Link className="link mt-4 inline-block" href="/pacts">
          Back to board
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <PactSummary pact={pact} />
        <RoleActionPanel pact={pact} onSuccess={() => void refetch()} />
      </div>
      <LedgerDisclosure pact={pact} />
    </div>
  );
}
