import deployedContracts from "~~/contracts/deployedContracts";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";

export const MERGEPACT_CONTRACT_NAME = "MergePact" as const;

export function getMergePactContractAddress(chainId?: number): `0x${string}` | undefined {
  const envAddress = process.env.NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS;
  if (envAddress && envAddress !== "0x0000000000000000000000000000000000000000") {
    return envAddress as `0x${string}`;
  }

  const id = chainId ?? MONAD_TESTNET_CHAIN_ID;
  const deployments = deployedContracts[id as keyof typeof deployedContracts] as
    | Record<string, { address: `0x${string}` }>
    | undefined;
  const fromDeployments = deployments?.[MERGEPACT_CONTRACT_NAME]?.address;

  if (fromDeployments && fromDeployments !== "0x0000000000000000000000000000000000000000") {
    return fromDeployments;
  }

  return undefined;
}

export function isContractConfigured(chainId?: number) {
  const address = getMergePactContractAddress(chainId ?? MONAD_TESTNET_CHAIN_ID);
  return Boolean(address && address !== "0x0000000000000000000000000000000000000000");
}
