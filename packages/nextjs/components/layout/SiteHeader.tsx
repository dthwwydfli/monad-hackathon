"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const NAV = [
  { href: "/pacts", label: "Pacts" },
  { href: "/preview", label: "Preview" },
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
        stroke="var(--ink)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function NavCtaButton({ className, onHero = false }: { className?: string; onHero?: boolean }) {
  return (
    <Link
      className={cn(
        "nav-cta inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--ink)] to-[var(--action)] pl-5 pr-2 py-2 text-sm font-semibold text-white transition-all hover:brightness-105",
        onHero && "shadow-md",
        className,
      )}
      href="/create"
    >
      Fund a pact
      <span className="flex size-7 items-center justify-center rounded-full bg-white">
        <NavArrowIcon />
      </span>
    </Link>
  );
}

function PillNavRail({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary"
      className="nav-pill-rail hidden items-center gap-0.5 rounded-full border border-[var(--rule)] bg-[var(--paper)]/95 px-1 py-1 shadow-sm md:flex"
    >
      {NAV.map(item => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors",
              active
                ? "border border-[var(--rule)] bg-white font-medium text-[var(--ink)]"
                : "text-[var(--ink)]/55 hover:text-[var(--ink)]/75",
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

function MobileMenuButton({ open, onToggle, onHero }: { open: boolean; onToggle: () => void; onHero: boolean }) {
  return (
    <button
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="flex cursor-pointer flex-col gap-1.5 border-0 bg-transparent p-1 md:hidden"
      onClick={onToggle}
      type="button"
    >
      <span
        className={cn(
          "block h-0.5 w-6 transition-transform",
          onHero ? "bg-white" : "bg-[var(--ink)]",
          open && "translate-y-2 rotate-45",
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 transition-opacity",
          onHero ? "bg-white" : "bg-[var(--ink)]",
          open && "opacity-0",
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 transition-transform",
          onHero ? "bg-white" : "bg-[var(--ink)]",
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
    <div className="absolute left-0 top-full z-50 flex w-full flex-col gap-1 border-t border-[var(--rule)] bg-[var(--paper)] p-5 md:hidden">
      {NAV.map(item => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            className={cn(
              "min-h-12 rounded-lg px-4 py-2.5 text-sm transition-colors",
              active
                ? "border border-[var(--rule)] bg-white font-medium text-[var(--ink)]"
                : "text-[var(--ink)]/55 hover:bg-white/60 hover:text-[var(--ink)]/75",
            )}
            href={item.href}
            key={item.href}
            onClick={onClose}
          >
            {item.label}
          </Link>
        );
      })}
      <NavCtaButton className="mt-3 w-fit" onHero={onHero} />
      <div className="mt-3">
        <WalletGate compact onHero={false} />
      </div>
    </div>
  );
}

export function SiteHeader({ variant }: { variant: "hero" | "default" }) {
  const pathname = usePathname();
  const onHero = variant === "hero";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b transition-colors duration-200",
        onHero ? "border-transparent bg-transparent" : "border-[var(--rule)] bg-[var(--paper)]/85 backdrop-blur-sm",
      )}
    >
      <div className="relative mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 md:px-10">
        <Link
          className={cn(
            "shrink-0 font-mono text-lg font-semibold tracking-tight transition-colors",
            onHero ? "text-white" : "text-[var(--ink)]",
          )}
          href="/"
        >
          {content.productName}
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <PillNavRail pathname={pathname} />
        </div>

        <div className="flex items-center gap-3">
          <NavCtaButton className="hidden md:inline-flex" onHero={onHero} />
          <div className="hidden md:block">
            <WalletGate compact onHero={onHero} />
          </div>
          <MobileMenuButton onHero={onHero} onToggle={() => setMenuOpen(prev => !prev)} open={menuOpen} />
        </div>
      </div>

      <MobileNavDrawer onClose={() => setMenuOpen(false)} onHero={onHero} open={menuOpen} pathname={pathname} />
    </header>
  );
}
