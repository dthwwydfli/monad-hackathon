"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Card, CardContent } from "~~/components/ui/card";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";
import { PACT_STATE, PactStateValue } from "~~/lib/pact";

/**
 * The four happy-path steps in `content.howItWorks.steps` map 1:1 onto the
 * contract's states, so the stamp shown here is the same component the real
 * board uses. Nothing is duplicated: PACT_STATE stays the source of truth.
 */
const STEP_STATE: PactStateValue[] = [PACT_STATE.Open, PACT_STATE.Claimed, PACT_STATE.Submitted, PACT_STATE.Released];

const STEP_COUNT = STEP_STATE.length;
const ADVANCE_MS = 5200;

const EXAMPLE = {
  issuePath: "monad-developers/docs/issues/12",
  acceptance: "Add a getting-started guide for testnet faucet setup with screenshots.",
  bounty: "0.50",
  maintainer: "0x7a3f…c91e",
  contributor: "0x9c1d…4f82",
  proof: "monad-developers/docs/pull/45",
};

function StepRail({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <ol className="flex flex-wrap gap-2" role="tablist">
      {content.howItWorks.steps.map((step, index) => {
        const isActive = index === active;
        const isPast = index < active;
        return (
          <li key={step.title}>
            <button
              aria-selected={isActive}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                isActive
                  ? "border-[var(--action)] bg-[var(--action)] text-[var(--on-dark)]"
                  : isPast
                    ? "border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)]"
                    : "border-[var(--rule)] text-[var(--ink)]/55 hover:border-[var(--action)] hover:text-[var(--ink)]",
              )}
              onClick={() => onSelect(index)}
              role="tab"
              type="button"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                  isActive ? "bg-[var(--on-dark)]/15 text-[var(--on-dark)]" : "bg-[var(--muted)] text-[var(--ink)]",
                )}
              >
                {index + 1}
              </span>
              {step.title.replace(/\.$/, "")}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepDetail({ index }: { index: number }) {
  const step = content.howItWorks.steps[index];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Step {index + 1} · {step.actor} acts
        </p>
        <h3 className="mt-2 text-2xl font-medium">{step.title}</h3>
        <p className="mt-2 text-[var(--muted-foreground)]">{step.body}</p>
      </div>

      <dl className="space-y-4 border-t border-[var(--rule)] pt-5">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            What the contract records
          </dt>
          <dd className="mt-1.5 text-sm">{step.records}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            What&apos;s now irreversible
          </dt>
          <dd className="mt-1.5 text-sm">{step.irreversible}</dd>
        </div>
      </dl>
    </div>
  );
}

function ExampleCard({ index }: { index: number }) {
  const state = STEP_STATE[index];
  const claimed = index >= 1;
  const submitted = index >= 2;
  const released = index >= 3;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <PactStatusStamp state={state} />
          <p className="font-mono text-xs">{EXAMPLE.bounty} Testnet MON</p>
        </div>

        <h4 className="mt-4 font-mono text-sm">{EXAMPLE.issuePath}</h4>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{EXAMPLE.acceptance}</p>

        <dl className="mt-5 space-y-2.5 border-t border-[var(--rule)] pt-4 font-mono text-xs">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Maintainer</dt>
            <dd>{EXAMPLE.maintainer}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Contributor</dt>
            <dd className={cn(!claimed && "text-[var(--ink)]/35")}>{claimed ? EXAMPLE.contributor : "unassigned"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Proof</dt>
            <dd className={cn("truncate", !submitted && "text-[var(--ink)]/35")}>
              {submitted ? EXAMPLE.proof : "not submitted"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Bounty held by</dt>
            <dd>{released ? "released to contributor" : "contract"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export function LifecycleWalkthrough({ id = "lifecycle" }: { id?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const select = useCallback((index: number) => {
    setActive(index);
    setPaused(true);
  }, []);

  // Auto-advance so an unattended screen still tells the story, but any
  // interaction hands control to the reader for good.
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setInterval(() => setActive(current => (current + 1) % STEP_COUNT), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, reduced]);

  return (
    <section className="border-t border-[var(--rule)] py-16 md:py-24" id={id}>
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">The commit lifecycle</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">
          Four steps. Two people. No middleman.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">Click through below — no wallet needed.</p>

        <div className="mt-10">
          <StepRail active={active} onSelect={select} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
          {reduced ? (
            <>
              <StepDetail index={active} />
              <ExampleCard index={active} />
            </>
          ) : (
            <>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={active}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <StepDetail index={active} />
                </motion.div>
              </AnimatePresence>
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                key={`card-${active}`}
                transition={{ duration: 0.25 }}
              >
                <ExampleCard index={active} />
              </motion.div>
            </>
          )}
        </div>

        <div className="mt-14 border-t border-[var(--rule)] pt-10">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            When it doesn&apos;t go to plan
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {content.howItWorks.branches.map(branch => (
              <div className="border-l-2 border-[var(--review)] pl-4" key={branch.title}>
                <h3 className="font-medium">{branch.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{branch.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-[var(--muted-foreground)]">{content.howItWorks.noDispute}</p>
        </div>
      </div>
    </section>
  );
}
