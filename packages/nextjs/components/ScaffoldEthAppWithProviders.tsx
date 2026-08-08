"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#3B5BDB" />
        <RainbowKitProvider avatar={BlockieAvatar} theme={lightTheme()}>
          {mounted ? <MergePactApp>{children}</MergePactApp> : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
