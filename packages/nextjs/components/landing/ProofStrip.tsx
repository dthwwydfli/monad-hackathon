"use client";

import { ExplorerLink } from "~~/components/ui/ExplorerLink";
import { getMergePactContractAddress } from "~~/lib/contract";
import { shortenAddress } from "~~/lib/format";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";

/**
 * Answers the first question a sceptical reader has — "is any of this real?" —
 * before the pitch continues. Reads the same address the rest of the app does,
 * so it cannot drift out of sync with what the ledger is actually querying.
 */
export function ProofStrip() {
  const address = getMergePactContractAddress(MONAD_TESTNET_CHAIN_ID);

  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Contract",
      value: address ? (
        <ExplorerLink href={`/address/${address}`} label={shortenAddress(address, 6)} />
      ) : (
        <span className="font-mono text-sm text-[var(--muted-foreground)]">Not yet deployed</span>
      ),
    },
    { label: "Network", value: <span className="font-mono text-sm">Monad Testnet · {MONAD_TESTNET_CHAIN_ID}</span> },
    { label: "Backend", value: <span className="font-mono text-sm">None — contract reads only</span> },
    { label: "Source", value: <span className="font-mono text-sm">Public repository</span> },
  ];

  return (
    <section className="border-b border-[var(--rule)] bg-[var(--surface)]/60">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-6 px-5 py-8 md:grid-cols-4 md:px-10">
        {facts.map(fact => (
          <div key={fact.label}>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{fact.label}</p>
            <div className="mt-2">{fact.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
