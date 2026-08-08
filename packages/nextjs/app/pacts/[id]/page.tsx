"use client";

import { use } from "react";
import Link from "next/link";
import { LedgerDisclosure, PactSummary } from "~~/components/pact/PactSummary";
import { RoleActionPanel } from "~~/components/pact/RoleActionPanel";
import { content } from "~~/config/content";
import { usePact } from "~~/hooks/usePact";

export default function PactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pactId = Number(id);
  const { pact, isLoading, notFound, refetch, isConfigured } = usePact(pactId);

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

  if (isLoading) return <p>Loading pact…</p>;

  if (notFound || !pact) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">This pact does not exist.</h1>
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
