"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { shortenAddress } from "~~/lib/format";
import { FAUCET_URL, MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";

export function WalletGate({ compact = false, onHero = false }: { compact?: boolean; onHero?: boolean }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const onMonad = chainId === MONAD_TESTNET_CHAIN_ID;

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            className={
              onHero
                ? "mp-btn min-h-12 shrink-0 border border-white/40 bg-white/10 text-white hover:bg-white/20"
                : "mp-btn mp-btn-secondary min-h-12 shrink-0"
            }
            onClick={openConnectModal}
            type="button"
          >
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
    <div
      className={
        onHero
          ? "flex max-w-[min(100%,220px)] shrink-0 items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-2 font-mono text-xs text-white backdrop-blur-sm sm:max-w-none"
          : "flex max-w-[min(100%,220px)] shrink-0 items-center gap-2 rounded-full border border-[var(--rule)] bg-white/60 px-3 py-2 font-mono text-xs sm:max-w-none"
      }
    >
      {!compact && <span className="hidden sm:inline">Connected</span>}
      <span className="truncate">{shortenAddress(address ?? "", 4)} · Monad Testnet</span>
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
