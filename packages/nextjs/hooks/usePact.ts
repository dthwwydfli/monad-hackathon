"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { getMergePactContractAddress } from "~~/lib/contract";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { PactData, parsePactFromContract } from "~~/lib/pact";

export function usePact(pactId: number) {
  const publicClient = usePublicClient({ chainId: MONAD_TESTNET_CHAIN_ID });
  const [pact, setPact] = useState<PactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const contractAddress = getMergePactContractAddress(MONAD_TESTNET_CHAIN_ID);
  const abi = deployedContracts[10143]?.MergePact?.abi;

  const refetch = useCallback(async () => {
    if (!publicClient || !contractAddress || !abi) {
      setPact(null);
      setIsLoading(false);
      return;
    }

    try {
      const total = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "totalPacts",
      })) as bigint;

      if (pactId < 0 || pactId >= Number(total)) {
        setNotFound(true);
        setPact(null);
        return;
      }

      const raw = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getPact",
        args: [BigInt(pactId)],
      });

      setPact(parsePactFromContract(pactId, raw as Parameters<typeof parsePactFromContract>[1]));
      setNotFound(false);
    } catch {
      setNotFound(true);
      setPact(null);
    } finally {
      setIsLoading(false);
    }
  }, [abi, contractAddress, pactId, publicClient]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { pact, isLoading, notFound, refetch, isConfigured: Boolean(contractAddress) };
}
