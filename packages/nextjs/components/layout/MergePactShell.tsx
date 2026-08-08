"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LedgerBackground } from "~~/components/background/LedgerBackground";
import { SiteHeader } from "~~/components/layout/SiteHeader";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

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

  const headerVariant = isHome && !scrolled ? "hero" : "default";

  return (
    <div className="grain relative min-h-screen">
      {(isPreview || isWall) && <LedgerBackground animated={!isWall} />}
      <SiteHeader variant={headerVariant} />
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
