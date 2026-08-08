"use client";

import { PayoutReceipt } from "./PayoutReceipt";
import { ScanConsole } from "./ScanConsole";
import { DemoFlow } from "./useDemoFlow";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const copy = content.demo.solve;

function Dormant() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--rule)] p-6">
      <p className="text-sm text-[var(--muted-foreground)]">{copy.dormant}</p>
    </div>
  );
}

/** The funded issue as a contributor sees it, populated from what was typed on the left. */
function BountyCard({ flow }: { flow: DemoFlow }) {
  const { state, pactState, contributor } = flow;
  return (
    <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PactStatusStamp state={pactState} />
        <p className="font-mono text-sm">{state.bountyMon} Testnet MON</p>
      </div>
      <p className="mt-4 truncate font-mono text-xs">{state.issueUrl}</p>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{state.acceptance}</p>
      <dl className="mt-4 space-y-2 border-t border-[var(--rule)] pt-3 font-mono text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[var(--muted-foreground)]">Maintainer</dt>
          <dd>{flow.maintainer}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[var(--muted-foreground)]">Contributor</dt>
          <dd className={cn(!contributor && "text-[var(--ink)]/35")}>{contributor ?? "unassigned"}</dd>
        </div>
      </dl>
    </div>
  );
}

function ProofForm({ flow }: { flow: DemoFlow }) {
  const { state, setField } = flow;
  const ready = state.proofUrl.trim().length > 0;

  return (
    <form
      className="space-y-3"
      onSubmit={event => {
        event.preventDefault();
        if (ready) flow.verify();
      }}
    >
      <Label htmlFor="demo-proof">{copy.proofLabel}</Label>
      <Input
        id="demo-proof"
        onChange={event => setField("proofUrl", event.target.value)}
        placeholder={copy.proofPlaceholder}
        value={state.proofUrl}
      />
      <Button className="w-full" disabled={!ready} type="submit">
        {copy.verify}
      </Button>
    </form>
  );
}

function Releasing() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--review)] bg-[rgba(238,155,0,0.12)] px-4 py-3 text-sm">
      <motion.span
        animate={{ rotate: 360 }}
        className="block size-3.5 shrink-0 rounded-full border border-[var(--review)] border-t-transparent"
        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
      />
      {copy.releasing}
    </div>
  );
}

function Body({ flow }: { flow: DemoFlow }) {
  const { state, scanLines } = flow;

  switch (state.stage) {
    case "draft":
    case "funding":
      return <Dormant />;
    case "open":
    case "claiming":
      return (
        <div className="space-y-5">
          <BountyCard flow={flow} />
          <Button className="w-full" disabled={state.stage === "claiming"} onClick={flow.claim} type="button">
            {state.stage === "claiming" ? copy.claiming : copy.claim}
          </Button>
        </div>
      );
    case "claimed":
      return (
        <div className="space-y-5">
          <BountyCard flow={flow} />
          <ProofForm flow={flow} />
        </div>
      );
    case "verifying":
    case "verified":
      return (
        <div className="space-y-5">
          <BountyCard flow={flow} />
          <ScanConsole done={state.stage === "verified"} lines={scanLines} step={state.scanStep} />
        </div>
      );
    case "releasing":
      return (
        <div className="space-y-5">
          <BountyCard flow={flow} />
          <ScanConsole done lines={scanLines} step={scanLines.length} />
          <Releasing />
        </div>
      );
    case "released":
      return (
        <div className="space-y-5">
          <BountyCard flow={flow} />
          <PayoutReceipt flow={flow} />
          <Button className="w-full" onClick={flow.reset} type="button" variant="secondary">
            {copy.replay}
          </Button>
        </div>
      );
  }
}

export function SolvePanel({ flow }: { flow: DemoFlow }) {
  const reduced = useReducedMotion();
  const active = flow.activeSide === "solve";

  // Keyed on the stages that swap the whole body, not on every stage, so the
  // scan console is not torn down and rebuilt between its own sub-states.
  const bodyKey = ["verifying", "verified", "releasing"].includes(flow.state.stage) ? "review" : flow.state.stage;

  return (
    <section
      aria-label={`${copy.side}: ${copy.title}`}
      className={cn(
        "rounded-xl border bg-[var(--surface)] p-6 transition-colors duration-300",
        active ? "border-[var(--action)]" : "border-[var(--rule)] opacity-60",
      )}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{copy.side}</p>
      <h3 className="mt-2 text-xl font-medium">{copy.title}</h3>
      <p className="mt-1.5 mb-6 text-sm text-[var(--muted-foreground)]">{copy.lead}</p>

      {reduced ? (
        <Body flow={flow} />
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key={bodyKey}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Body flow={flow} />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
