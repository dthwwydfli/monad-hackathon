"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { TestnetNotice } from "~~/components/ui/TestnetNotice";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

function HeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative z-[2] mx-auto flex min-h-[min(92vh,880px)] max-w-[1180px] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-20 md:pt-32 lg:pb-24",
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/70">{content.heroEyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
        {content.heroHeadline}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{content.heroBody}</p>
      <TestnetNotice compact className="mt-4 text-white/60" />
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/create">Fund a pact</Link>
        </Button>
        <Button
          asChild
          className="border-white/45 bg-white/10 text-white hover:bg-white/20"
          size="lg"
          variant="secondary"
        >
          <Link href="/pacts">Browse open pacts</Link>
        </Button>
      </div>
      <p className="mt-10 hidden max-w-md font-mono text-xs uppercase tracking-[0.08em] text-white/75 md:block">
        Funded on-chain · GitHub holds the work. Monad holds the pact.
      </p>
    </div>
  );
}

function HeroBackground() {
  return (
    <>
      <Image
        alt=""
        aria-hidden
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="/hero-nature.jpg"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/80 via-[var(--ink)]/50 to-[var(--ink)]/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/55 via-transparent to-[var(--ink)]/25"
      />
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 z-[1]" />
    </>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section className="relative min-h-[min(92vh,880px)] w-full overflow-hidden border-b border-[var(--rule)]">
        <HeroBackground />
        <HeroContent />
      </section>
    );
  }

  return (
    <section className="relative min-h-[min(92vh,880px)] w-full overflow-hidden border-b border-[var(--rule)]">
      <HeroBackground />
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <HeroContent />
      </motion.div>
    </section>
  );
}
