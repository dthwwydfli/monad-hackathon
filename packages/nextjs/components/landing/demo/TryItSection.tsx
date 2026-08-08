"use client";

import { FundPanel } from "./FundPanel";
import { SolvePanel } from "./SolvePanel";
import { useDemoFlow } from "./useDemoFlow";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const copy = content.demo;

/**
 * The bounty visibly leaving the maintainer and landing on the contributor.
 * Rendered twice — once per axis — because the panels sit side by side on
 * desktop and stack on mobile, and animating one axis per breakpoint is far
 * simpler than trying to make a single element do both.
 */
function TransferPill({ amount, axis }: { amount: string; axis: "x" | "y" }) {
  const from = axis === "x" ? { left: "28%", top: "50%" } : { left: "50%", top: "30%" };
  const to = axis === "x" ? { left: "72%", top: "50%" } : { left: "50%", top: "70%" };

  return (
    <motion.div
      animate={{ ...to, opacity: [0, 1, 1, 0] }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--confirmed)] bg-[var(--paper)] px-4 py-2 font-mono text-sm text-[var(--confirmed)]"
      initial={{ ...from, opacity: 0 }}
      transition={{ duration: 1.1, ease: "easeInOut", times: [0, 0.15, 0.8, 1] }}
    >
      {amount} MON →
    </motion.div>
  );
}

/**
 * `contained` is on by default for the landing page, where sections own their
 * own gutter. Routes that already sit inside the shell's 1180px column pass
 * `false` so the padding is not applied twice.
 */
export function TryItSection({ id = "lifecycle", contained = true }: { id?: string; contained?: boolean }) {
  const flow = useDemoFlow();
  const reduced = useReducedMotion();
  const transferring = flow.state.stage === "releasing";

  const inner = (
    <>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">{copy.headline}</h2>
          {flow.state.stage !== "draft" && (
            <button
              className="cursor-pointer text-sm text-[var(--action-tint)] underline underline-offset-2 hover:opacity-80"
              onClick={flow.reset}
              type="button"
            >
              Start over
            </button>
          )}
        </div>
        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">{copy.body}</p>

        <div className="relative mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <FundPanel flow={flow} />
          <SolvePanel flow={flow} />

          {!reduced && (
            <AnimatePresence>
              {transferring && (
                <>
                  <div className="pointer-events-none absolute inset-0 hidden lg:block" key="pill-x">
                    <TransferPill amount={flow.state.bountyMon} axis="x" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 lg:hidden" key="pill-y">
                    <TransferPill amount={flow.state.bountyMon} axis="y" />
                  </div>
                </>
              )}
            </AnimatePresence>
          )}
        </div>

        <p className="mt-8 max-w-3xl text-sm text-[var(--muted-foreground)]">{copy.disclaimer}</p>
      </div>
    </>
  );

  return (
    <section className={cn("py-16 md:py-24", contained ? "border-t border-[var(--rule)]" : "pt-0 md:pt-0")} id={id}>
      {contained ? <div className="mx-auto max-w-[1180px] px-5 md:px-10">{inner}</div> : inner}
    </section>
  );
}
