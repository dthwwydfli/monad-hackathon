import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  // 600 is used by badges, status stamps and eyebrow labels. Without it the
  // browser synthesised a fake bold.
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata = getMetadata({
  title: "commit",
  description: "Public Testnet work commitments on Monad. Fund the fix. Make the commitment visible.",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-theme="dark" className={`${instrument.variable} ${ibmMono.variable}`}>
      <body className="font-[family-name:var(--font-display)]">
        <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
      </body>
    </html>
  );
};

export default RootLayout;
