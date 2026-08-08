"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { TestnetNotice } from "~~/components/ui/TestnetNotice";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";

export function HeroSection() {
  const reduced = useReducedMotion();

  const copy = (
    <div className="flex flex-col justify-center px-5 py-12 md:px-10 md:py-16 lg:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
        {content.heroEyebrow}
      </p>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
        {content.heroHeadline}
      </h1>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--muted-foreground)]">{content.heroBody}</p>
      <TestnetNotice compact />
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/create">Fund a pact</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/pacts">Browse open pacts</Link>
        </Button>
      </div>
    </div>
  );

  const imagePanel = (
    <div className="relative min-h-[280px] px-5 pb-12 md:min-h-[420px] md:px-10 md:pb-16 lg:min-h-0 lg:pb-20">
      <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-[var(--ink)] shadow-[var(--shadow-card)] md:min-h-[420px] lg:min-h-[480px]">
        <Image
          alt="Calm lake and mountains — open engineering ledger"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          src="/hero-nature.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/25 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/90">Funded on-chain</p>
          <p className="mt-1 text-sm text-white/80">GitHub holds the work. Monad holds the pact.</p>
        </div>
      </div>
    </div>
  );

  if (reduced) {
    return (
      <section className="border-b border-[var(--rule)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-[1180px] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          {copy}
          {imagePanel}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[var(--rule)] bg-[var(--paper)]">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid max-w-[1180px] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {copy}
        {imagePanel}
      </motion.div>
    </section>
  );
}
