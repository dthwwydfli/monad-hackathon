"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const HERO_HEIGHT = "min-h-[100dvh]";

const heroTextShadow = "drop-shadow-[0_2px_12px_rgba(0,18,25,0.65)]";

function HeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative z-[2] mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 text-center md:px-10",
        className,
      )}
    >
      <h1
        className={cn(
          "max-w-[18ch] text-4xl font-medium leading-[1.1] tracking-[-0.01em] text-white md:text-5xl lg:text-[3.5rem]",
          heroTextShadow,
        )}
      >
        {content.heroHeadline}
      </h1>
      <p className={cn("mt-5 max-w-xl text-lg leading-relaxed text-white/90", heroTextShadow)}>{content.heroBody}</p>

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
        Dark scrim uses --paper (the dark surface token), not --ink (text color).
        Keeps white hero type readable while the photo still shows through on the right.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--paper)]/75 via-[var(--paper)]/45 to-[var(--paper)]/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--paper)]/50 via-transparent to-[var(--paper)]/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_58%_42%_at_50%_30%,rgba(0,18,25,0.65),transparent_72%)]"
      />
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 z-[1]" />
    </>
  );
}

function HeroBody() {
  return (
    <div
      className={cn("relative z-[2] flex items-center justify-center px-5 pb-16 pt-28 md:px-10 md:pt-32", HERO_HEIGHT)}
    >
      <HeroContent />
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className={cn("relative w-full overflow-hidden", HERO_HEIGHT)}>
      <HeroBackground />
      {reduced ? (
        <HeroBody />
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative z-[2]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <HeroBody />
        </motion.div>
      )}
    </section>
  );
}
