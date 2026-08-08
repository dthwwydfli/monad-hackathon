"use client";

import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { MergePactShell } from "~~/components/layout/MergePactShell";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const MergePactApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MergePactShell>{children}</MergePactShell>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  // The shell renders on the server. wagmi is configured with `ssr: true`, so
  // only the wallet-dependent UI needs a mount guard — it lives in WalletGate.
  // Gating the whole tree here meant no SSR content at all and a blank first
  // paint, which was the entire first impression on a cold load.
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#0A9396" />
        <RainbowKitProvider avatar={BlockieAvatar} theme={lightTheme()}>
          <MergePactApp>{children}</MergePactApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
