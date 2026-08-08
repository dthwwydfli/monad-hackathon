"use client";

import { useCallback, useState } from "react";
import { parseEventLogs } from "viem";
import { usePublicClient } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getMergePactContractAddress } from "~~/lib/contract";
import { monToWei } from "~~/lib/format";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { mapContractError } from "~~/lib/pact";
import { validateCreateForm } from "~~/lib/validation";

export type CreatePactInput = {
  issueUrl: string;
  acceptance: string;
  bountyMon: string;
  claimDeadline: Date;
  workDeadline: Date;
};

export function useCreatePact() {
  const publicClient = usePublicClient({ chainId: MONAD_TESTNET_CHAIN_ID });
  const { writeContractAsync, isPending, isMining } = useScaffoldWriteContract({
    contractName: "MergePact",
    chainId: MONAD_TESTNET_CHAIN_ID,
  });
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);

  const createPact = useCallback(
    async (input: CreatePactInput) => {
      setError(null);
      const fieldErrors = validateCreateForm(input);
      if (Object.keys(fieldErrors).length > 0) {
        throw fieldErrors;
      }

      try {
        const hash = await writeContractAsync({
          functionName: "createPact",
          args: [
            input.issueUrl,
            input.acceptance,
            Number(Math.floor(input.claimDeadline.getTime() / 1000)),
            Number(Math.floor(input.workDeadline.getTime() / 1000)),
          ],
          value: monToWei(input.bountyMon),
        });

        if (!hash || !publicClient) return undefined;
        setTxHash(hash);

        const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
        const abi = deployedContracts[10143]?.MergePact?.abi;
        const logs = parseEventLogs({
          abi,
          logs: receipt.logs,
          eventName: "PactCreated",
        });

        const pactId = logs[0]?.args?.pactId;
        return pactId !== undefined ? Number(pactId) : undefined;
      } catch (e) {
        if (e && typeof e === "object" && !("issueUrl" in (e as object))) {
          setError(mapContractError(e));
        }
        throw e;
      }
    },
    [publicClient, writeContractAsync],
  );

  return {
    createPact,
    isPending: isPending || isMining,
    txHash,
    error,
    isConfigured: Boolean(getMergePactContractAddress(MONAD_TESTNET_CHAIN_ID)),
  };
}
