"use client";

import { useCallback, useEffect, useState } from "react";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { usePacts } from "~~/hooks/usePacts";
import { formatMon, shortenAddress } from "~~/lib/format";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { PACT_STATE } from "~~/lib/pact";
import { parseIssuePath } from "~~/lib/validation";

export type PulseEvent = {
  id: string;
  message: string;
  kind: "created" | "claimed" | "proof" | "released" | "cancelled" | "reclaimed";
};

/**
 * Widened so the released counter on /wall reflects the whole ledger rather
 * than only the handful of cards on screen. One sweep covers both.
 */
const STATS_WINDOW = 100;

type EventArgs = Record<string, unknown>;
type EventLog = { transactionHash?: string | null; logIndex?: number | null; args?: EventArgs };

function pactLabel(args: EventArgs) {
  const id = args.pactId;
  return id === undefined ? "A pact" : `Pact #${String(id)}`;
}

function monLabel(args: EventArgs) {
  const wei = args.bountyWei;
  return typeof wei === "bigint" ? `${formatMon(wei)} MON` : "";
}

function addressLabel(args: EventArgs, key: string) {
  const value = args[key];
  return typeof value === "string" ? shortenAddress(value) : "";
}

// The contract already emits everything needed for specific copy — amounts,
// addresses and issue paths — so the feed no longer says "a pact was funded".
const DESCRIBE: Record<PulseEvent["kind"], (args: EventArgs) => string> = {
  created: args => {
    const issue = typeof args.issueUrl === "string" ? parseIssuePath(args.issueUrl) : "";
    return [`${pactLabel(args)} funded`, monLabel(args), issue].filter(Boolean).join(" · ");
  },
  claimed: args => {
    const who = addressLabel(args, "contributor");
    return who ? `${pactLabel(args)} claimed by ${who}` : `${pactLabel(args)} claimed`;
  },
  proof: args => `${pactLabel(args)} · proof submitted for review`,
  released: args => {
    const who = addressLabel(args, "contributor");
    return [`${pactLabel(args)} released`, monLabel(args), who && `to ${who}`].filter(Boolean).join(" · ");
  },
  cancelled: args => `${pactLabel(args)} cancelled · bounty refunded`,
  reclaimed: args => `${pactLabel(args)} reclaimed · deadline passed`,
};

export function usePactPulse(limit: number = 6) {
  // This hook owns the polling interval, so the inner hook's is switched off.
  const { pacts, refreshing, refetch, isConfigured, error } = usePacts(STATS_WINDOW, { poll: false });
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([]);

  const handleLogs = useCallback(
    (kind: PulseEvent["kind"]) => (logs: readonly unknown[]) => {
      const next = logs.map((raw, index) => {
        const log = raw as EventLog;
        return {
          id: `${log.transactionHash ?? "log"}-${log.logIndex ?? index}`,
          message: DESCRIBE[kind](log.args ?? {}),
          kind,
        };
      });
      setPulseEvents(current => [...next, ...current].slice(0, 8));
      void refetch();
    },
    [refetch],
  );

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactCreated",
    onLogs: handleLogs("created"),
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactClaimed",
    onLogs: handleLogs("claimed"),
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "ProofSubmitted",
    onLogs: handleLogs("proof"),
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactReleased",
    onLogs: handleLogs("released"),
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactCancelled",
    onLogs: handleLogs("cancelled"),
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactReclaimed",
    onLogs: handleLogs("reclaimed"),
  });

  useEffect(() => {
    const interval = setInterval(() => void refetch(), 8000);
    return () => clearInterval(interval);
  }, [refetch]);

  const releasedCount = pacts.filter(p => p.state === PACT_STATE.Released).length;

  return {
    pacts: pacts.slice(0, limit),
    releasedCount,
    pulseEvents,
    refreshing,
    isConfigured,
    error,
    refetch,
  };
}
