import { defineChain } from "viem";

export const MONAD_TESTNET_CHAIN_ID = 10143;

export const monadTestnet = defineChain({
  id: MONAD_TESTNET_CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
      webSocket: ["wss://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "MonadVision", url: "https://testnet.monadvision.com" },
  },
});

export const FAUCET_URL = "https://faucet.monad.xyz";
export const EXPLORER_URL = "https://testnet.monadvision.com";

export function getExplorerTxUrl(txHash: string) {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`;
}
