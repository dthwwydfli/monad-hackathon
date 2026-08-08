"use client";

import { useEffect, useState } from "react";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { usePacts } from "~~/hooks/usePacts";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { PACT_STATE } from "~~/lib/pact";

export type PulseEvent = {
  id: string;
  message: string;
  kind: "created" | "claimed" | "proof" | "released";
};

const GENERIC_MESSAGES = {
  created: "A pact was funded",
  claimed: "A contributor claimed a pact",
  proof: "A proof was recorded",
  released: "A Testnet bounty was released",
} as const;

export function usePactPulse(limit: number = 6) {
  const { pacts, refreshing, refetch, isConfigured } = usePacts(limit);
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([]);

  const pushEvents = (events: PulseEvent[]) => {
    setPulseEvents(current => [...events, ...current].slice(0, 8));
  };

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactCreated",
    onLogs: logs => {
      pushEvents(
        logs.map(log => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          message: GENERIC_MESSAGES.created,
          kind: "created" as const,
        })),
      );
      void refetch();
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactClaimed",
    onLogs: logs => {
      pushEvents(
        logs.map(log => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          message: GENERIC_MESSAGES.claimed,
          kind: "claimed" as const,
        })),
      );
      void refetch();
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "ProofSubmitted",
    onLogs: logs => {
      pushEvents(
        logs.map(log => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          message: GENERIC_MESSAGES.proof,
          kind: "proof" as const,
        })),
      );
      void refetch();
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
    eventName: "PactReleased",
    onLogs: logs => {
      pushEvents(
        logs.map(log => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          message: GENERIC_MESSAGES.released,
          kind: "released" as const,
        })),
      );
      void refetch();
    },
  });

  useEffect(() => {
    const interval = setInterval(() => void refetch(), 8000);
    return () => clearInterval(interval);
  }, [refetch]);

  const releasedCount = pacts.filter(p => p.state === PACT_STATE.Released).length;

  return { pacts, releasedCount, pulseEvents, refreshing, isConfigured, refetch };
}
