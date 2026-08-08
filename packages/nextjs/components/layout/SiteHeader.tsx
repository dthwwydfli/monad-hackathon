"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const NAV = [
  { href: "/pacts", label: "Commits" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/wall", label: "Live wall" },
];

function isNavActive(pathname: string, href: string) {
  return pathname === href || (href === "/pacts" && pathname.startsWith("/pacts/"));
}

function NavArrowIcon() {
  return (
    <svg aria-hidden fill="none" height="10" viewBox="0 0 12 10" width="12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M.6 4.602h10m-4-4 4 4-4 4"
        stroke="var(--on-dark)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/**
 * Full pill-and-arrow treatment. Only affordable at xl on desktop, where the
 * three grid zones still leave slack; below that the header carries the wallet
 * alone and this moves into the drawer.
 */
function NavCtaButton({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full bg-[var(--action)] py-2 pl-5 pr-2 text-sm font-medium text-[var(--on-dark)] transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]",
        className,
      )}
      href="/create"
    >
      Fund an issue
      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--on-dark)]/15">
        <NavArrowIcon />
      </span>
    </Link>
  );
}

/**
 * Plain link rail. The pill-and-active-chip treatment read as a control surface;
 * on a dark ground the active item only needs full-strength text against dimmed
 * siblings, which is how Mercury separates its own nav.
 */
function PillNavRail({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
      {NAV.map(item => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap text-sm transition-colors duration-200",
              active ? "text-[var(--ink)]" : "text-[var(--ink)]/60 hover:text-[var(--ink)]",
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      aria-controls="site-nav-drawer"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="flex min-h-12 cursor-pointer flex-col justify-center gap-1.5 border-0 bg-transparent p-1 lg:hidden"
      onClick={onToggle}
      type="button"
    >
      <span
        className={cn(
          "block h-0.5 w-6 bg-[var(--ink)] transition-transform duration-200",
          open && "translate-y-2 rotate-45",
        )}
      />
      <span className={cn("block h-0.5 w-6 bg-[var(--ink)] transition-opacity duration-200", open && "opacity-0")} />
      <span
        className={cn(
          "block h-0.5 w-6 bg-[var(--ink)] transition-transform duration-200",
          open && "-translate-y-2 -rotate-45",
        )}
      />
    </button>
  );
}

function MobileNavDrawer({
  open,
  pathname,
  onHero,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onHero: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div
        aria-hidden
        className="absolute left-0 top-full z-40 h-screen w-full bg-black/60 lg:hidden"
        onClick={onClose}
      />
      <div
        className="absolute left-0 top-full z-50 flex w-full flex-col gap-1 border-t border-[var(--rule)] bg-[var(--paper)]/95 p-5 backdrop-blur-md lg:hidden"
        id="site-nav-drawer"
      >
        {NAV.map(item => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center rounded-xl px-4 py-2.5 text-sm transition-colors duration-200",
                active
                  ? "bg-[var(--surface)] font-medium text-[var(--ink)]"
                  : "text-[var(--ink)]/60 hover:bg-[var(--muted)] hover:text-[var(--ink)]",
              )}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              {item.label}
            </Link>
          );
        })}
        <NavCtaButton className="mt-3 w-fit" />
        <div className="mt-3">
          <WalletGate compact onHero={onHero} />
        </div>
      </div>
    </>
  );
}

export function SiteHeader({ variant, isHome = false }: { variant: "hero" | "default"; isHome?: boolean }) {
  const pathname = usePathname();
  const onHero = variant === "hero";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the drawer, and the page underneath must not scroll while it
  // is open. Both are skipped entirely when the drawer is closed.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "z-30 w-full transition-colors duration-200",
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        onHero
          ? "border-transparent bg-transparent"
          : "border-b border-[var(--rule)] bg-[var(--paper)]/85 backdrop-blur-sm",
      )}
    >
      {/*
        Three explicit grid zones. The rail used to be absolutely positioned and
        centred, which took it out of flow — nothing reserved space for it, so it
        overlapped the logo and the wallet from ~768px to ~1150px. As a real grid
        child in the 1fr track it can no longer collide with either neighbour.
      */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 md:px-10 lg:gap-6">
        <Link
          className={cn(
            "shrink-0 bg-transparent font-mono text-lg font-semibold tracking-tight transition-colors",
            onHero ? "text-white" : "text-[var(--ink)]",
          )}
          href="/"
        >
          {content.productName}
        </Link>

        <div className="flex min-w-0 justify-center">
          <PillNavRail pathname={pathname} />
        </div>

        <div className="flex items-center justify-end gap-3">
          <NavCtaButton className="hidden xl:inline-flex" />
          <div className="hidden lg:block">
            <WalletGate compact onHero={onHero} />
          </div>
          <MobileMenuButton onToggle={() => setMenuOpen(prev => !prev)} open={menuOpen} />
        </div>
      </div>

      <MobileNavDrawer onClose={() => setMenuOpen(false)} onHero={onHero} open={menuOpen} pathname={pathname} />
    </header>
  );
}
