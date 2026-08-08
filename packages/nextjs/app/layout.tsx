import { Familjen_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = getMetadata({
  title: "MergePact",
  description: "Public Testnet work commitments on Monad. Fund the fix. Make the pact visible.",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-theme="light" className={`${familjen.variable} ${ibmMono.variable}`}>
      <body className="font-[family-name:var(--font-display)]">
        <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
      </body>
    </html>
  );
};

export default RootLayout;
