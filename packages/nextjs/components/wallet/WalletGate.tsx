"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "~~/components/ui/button";
import { cn } from "~~/lib/cn";
import { shortenAddress } from "~~/lib/format";
import { FAUCET_URL, MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";

export function WalletGate({ compact = false, onHero = false }: { compact?: boolean; onHero?: boolean }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const onMonad = chainId === MONAD_TESTNET_CHAIN_ID;

  // The only wallet-dependent UI in the shell, so the hydration guard lives
  // here rather than around the whole app. A same-sized placeholder keeps the
  // header from reflowing when the real button swaps in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-hidden className="min-h-12 w-[136px] shrink-0" />;
  }

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            className={cn("shrink-0", onHero && "border-white/45 bg-white/10 text-white hover:bg-white/20")}
            onClick={openConnectModal}
            type="button"
            variant="secondary"
          >
            Connect wallet
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }

  if (!onMonad) {
    return (
      <Button
        className={cn("shrink-0", onHero && "border border-white/40 bg-transparent text-white hover:bg-white/10")}
        disabled={isPending}
        onClick={() => switchChain?.({ chainId: MONAD_TESTNET_CHAIN_ID })}
        type="button"
      >
        Switch to Monad Testnet
      </Button>
    );
  }

  return (
    <div
      className={
        onHero
          ? "flex max-w-[min(100%,240px)] shrink-0 items-center gap-2 bg-transparent px-1 py-2 font-mono text-xs text-white/90 sm:max-w-none"
          : "flex max-w-[min(100%,220px)] shrink-0 items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 font-mono text-xs sm:max-w-none"
      }
    >
      {!compact && <span className="hidden sm:inline">Connected</span>}
      <span className="truncate">{shortenAddress(address ?? "", 4)} · Monad Testnet</span>
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <button className={onHero ? "text-white underline" : "underline"} onClick={openAccountModal} type="button">
            Manage
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  );
}

export function FaucetLink({ className }: { className?: string }) {
  return (
    <a className={cn("link text-[var(--action)]", className)} href={FAUCET_URL} rel="noreferrer" target="_blank">
      Get Testnet MON from the faucet
    </a>
  );
}
