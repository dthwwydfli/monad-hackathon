"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { demo } from "~~/config/demo";
import deployedContracts from "~~/contracts/deployedContracts";
import { getMergePactContractAddress } from "~~/lib/contract";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { PactData, parsePactFromContract } from "~~/lib/pact";

export function usePacts(limit: number = demo.maxVisiblePacts) {
  const publicClient = usePublicClient({ chainId: MONAD_TESTNET_CHAIN_ID });
  const [pacts, setPacts] = useState<PactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = getMergePactContractAddress(MONAD_TESTNET_CHAIN_ID);
  const abi = deployedContracts[10143]?.MergePact?.abi;

  const refetch = useCallback(async () => {
    if (!publicClient || !contractAddress || !abi) {
      setPacts([]);
      setIsLoading(false);
      return;
    }

    setRefreshing(true);
    setError(null);

    try {
      const total = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "totalPacts",
      })) as bigint;

      const count = Number(total);
      if (count === 0) {
        setPacts([]);
        return;
      }

      const start = Math.max(0, count - limit);
      const ids = Array.from({ length: count - start }, (_, i) => start + i).reverse();

      const results = await Promise.all(
        ids.map(async id => {
          const raw = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "getPact",
            args: [BigInt(id)],
          });
          return parsePactFromContract(id, raw as Parameters<typeof parsePactFromContract>[1]);
        }),
      );

      setPacts(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to refresh Monad Testnet right now.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [abi, contractAddress, limit, publicClient]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(() => void refetch(), 8000);
    return () => clearInterval(interval);
  }, [refetch]);

  return { pacts, isLoading, refreshing, error, refetch, isConfigured: Boolean(contractAddress) };
}
