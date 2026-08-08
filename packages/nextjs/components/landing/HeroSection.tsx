"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { TestnetNotice } from "~~/components/ui/TestnetNotice";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

/**
 * Near-full viewport, centred column. The photograph carries the lower half, so
 * the type sits in the upper third rather than dead centre — otherwise the
 * headline lands on the ridgeline and stops reading.
 */
const HERO_HEIGHT = "min-h-[min(92vh,880px)]";

function HeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative z-[2] mx-auto flex max-w-[1180px] flex-col items-center px-5 pb-16 pt-32 text-center md:px-10 md:pt-[18vh]",
        HERO_HEIGHT,
        className,
      )}
    >
      <h1 className="max-w-[18ch] text-4xl font-medium leading-[1.1] tracking-[-0.01em] text-white md:text-5xl lg:text-[3.5rem]">
        {content.heroHeadline}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{content.heroBody}</p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="#lifecycle">See how a commit works</Link>
        </Button>
        <Button
          asChild
          className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          size="lg"
          variant="secondary"
        >
          <Link href="/pacts">Browse open commits</Link>
        </Button>
      </div>
    </div>
  );
}

function HeroBackground() {
  return (
    <>
      <Image
        alt=""
        aria-hidden
        className="object-cover object-center saturate-[0.65] brightness-[0.92]"
        fill
        priority
        sizes="100vw"
        src="/hero-nature.jpg"
      />
      {/*
        A single top-down scrim, not a side wash: the composition is symmetric
        now, so darkening one edge would tilt it. It resolves to the page ground
        at the bottom so the section edge dissolves into the next one.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--paper)]/75 via-[var(--paper)]/25 to-[var(--paper)]"
      />
      {/* The valley in this frame is its own light source and washes out the
          headline where it crosses. A centred radial puts the contrast back
          without flattening the photograph at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_58%_42%_at_50%_30%,rgba(23,23,33,0.45),transparent_70%)]"
      />
    </>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className={cn("relative w-full overflow-hidden", HERO_HEIGHT)}>
      <HeroBackground />
      {reduced ? (
        <HeroContent />
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <HeroContent />
        </motion.div>
      )}

      {/* Mercury pins its regulatory line to the foot of the hero; this is ours. */}
      <div className="absolute inset-x-0 bottom-6 z-[2] flex justify-center px-5">
        <TestnetNotice compact className="!text-white/55" />
      </div>
    </section>
  );
}
