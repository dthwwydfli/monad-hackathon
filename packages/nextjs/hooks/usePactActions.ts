"use client";

import { useCallback, useState } from "react";
import { usePublicClient } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { mapContractError } from "~~/lib/pact";

export function usePactActions(onSuccess?: () => void) {
  const publicClient = usePublicClient({ chainId: MONAD_TESTNET_CHAIN_ID });
  const { writeContractAsync, isPending, isMining } = useScaffoldWriteContract({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
  });
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (fn: () => Promise<`0x${string}` | undefined>) => {
      // Both are cleared up front, otherwise the hash from the previous action
      // stays on screen and the next one appears to have already succeeded.
      setError(null);
      setTxHash(undefined);
      try {
        const hash = await fn();
        if (!hash || !publicClient) return;
        setTxHash(hash);
        await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
        onSuccess?.();
      } catch (e) {
        setError(mapContractError(e));
        throw e;
      }
    },
    [onSuccess, publicClient],
  );

  return {
    isPending: isPending || isMining,
    txHash,
    error,
    claimPact: (pactId: number) => run(() => writeContractAsync({ functionName: "claimPact", args: [BigInt(pactId)] })),
    submitProof: (pactId: number, proofUrl: string) =>
      run(() => writeContractAsync({ functionName: "submitProof", args: [BigInt(pactId), proofUrl] })),
    approveAndRelease: (pactId: number) =>
      run(() => writeContractAsync({ functionName: "approveAndRelease", args: [BigInt(pactId)] })),
    cancelPact: (pactId: number) =>
      run(() => writeContractAsync({ functionName: "cancelPact", args: [BigInt(pactId)] })),
    reclaimUnclaimed: (pactId: number) =>
      run(() => writeContractAsync({ functionName: "reclaimUnclaimed", args: [BigInt(pactId)] })),
    reclaimUnsubmitted: (pactId: number) =>
      run(() => writeContractAsync({ functionName: "reclaimUnsubmitted", args: [BigInt(pactId)] })),
  };
}
