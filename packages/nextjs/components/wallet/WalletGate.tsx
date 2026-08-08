"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { shortenAddress } from "~~/lib/format";
import { FAUCET_URL, MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";

export function WalletGate({ compact = false }: { compact?: boolean }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const onMonad = chainId === MONAD_TESTNET_CHAIN_ID;

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button className="mp-btn mp-btn-secondary min-h-12" onClick={openConnectModal} type="button">
            Connect wallet
          </button>
        )}
      </ConnectButton.Custom>
    );
  }

  if (!onMonad) {
    return (
      <button
        className="mp-btn mp-btn-action min-h-12"
        disabled={isPending}
        onClick={() => switchChain?.({ chainId: MONAD_TESTNET_CHAIN_ID })}
        type="button"
      >
        Switch to Monad Testnet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-white/60 px-3 py-2 font-mono text-xs">
      {!compact && <span className="hidden sm:inline">Connected</span>}
      <span>{shortenAddress(address ?? "", 4)} · Monad Testnet</span>
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <button className="underline" onClick={openAccountModal} type="button">
            Manage
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  );
}

export function FaucetLink() {
  return (
    <a className="link text-[var(--action)]" href={FAUCET_URL} rel="noreferrer" target="_blank">
      Get Testnet MON from the faucet
    </a>
  );
}
