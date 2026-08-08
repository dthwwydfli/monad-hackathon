"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LedgerBackground } from "~~/components/background/LedgerBackground";
import { Button } from "~~/components/ui/button";
import { WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const NAV = [
  { href: "/pacts", label: "Pacts" },
  { href: "/preview", label: "Preview" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/wall", label: "Live wall" },
];

export function MergePactShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname === "/preview";
  const isWall = pathname === "/wall";
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <div className="grain relative min-h-screen">
      {(isPreview || isWall) && <LedgerBackground animated={!isWall} />}
      <header
        className={cn(
          "sticky top-0 z-20 border-b transition-colors duration-200",
          isHome && !scrolled
            ? "border-transparent bg-transparent"
            : "border-[var(--rule)] bg-[var(--paper)]/85 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4">
          <Link className="font-mono text-lg font-semibold tracking-tight" href="/">
            {content.productName}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(item => (
              <Link
                className={cn(
                  "link text-sm transition-colors",
                  pathname === item.href || (item.href === "/pacts" && pathname.startsWith("/pacts/"))
                    ? "font-semibold text-[var(--action)]"
                    : "",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/create">Fund a pact</Link>
            </Button>
            <WalletGate compact />
          </div>
        </div>
      </header>
      <main
        className={cn(
          "relative z-10",
          isHome ? "px-0 py-0" : "mx-auto max-w-[1180px] px-5 py-8",
          isPreview && "max-w-none px-0",
        )}
      >
        {children}
      </main>
      {!isWall && (
        <footer className="relative z-10 border-t border-[var(--rule)] px-5 py-8 text-sm">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
            <p>{content.testnetNote}</p>
            <a className="link" href="https://github.com/dthwwydfli/monad-hackathon" rel="noreferrer" target="_blank">
              Public repository
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
