"use client";

import { DemoFlow } from "./useDemoFlow";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";
import { PACT_STATE } from "~~/lib/pact";

const copy = content.demo.fund;

function Form({ flow }: { flow: DemoFlow }) {
  const { state, setField } = flow;
  const pending = state.stage === "funding";
  // Anything goes — this is a simulation, so the only bar is "you typed something".
  const ready = state.issueUrl.trim().length > 0 && state.acceptance.trim().length > 0 && Number(state.bountyMon) > 0;

  return (
    <form
      className="space-y-5"
      onSubmit={event => {
        event.preventDefault();
        if (ready && !pending) flow.fund();
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="demo-issue">GitHub issue URL</Label>
          <button
            className="cursor-pointer text-xs text-[var(--action-tint)] underline underline-offset-2 hover:opacity-80 disabled:opacity-40"
            disabled={pending}
            onClick={flow.useExample}
            type="button"
          >
            {copy.useExample}
          </button>
        </div>
        <Input
          disabled={pending}
          id="demo-issue"
          onChange={event => setField("issueUrl", event.target.value)}
          placeholder={content.placeholders.issueUrl}
          value={state.issueUrl}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="demo-acceptance">Done when…</Label>
        <textarea
          className="min-h-20 w-full rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50"
          disabled={pending}
          id="demo-acceptance"
          maxLength={140}
          onChange={event => setField("acceptance", event.target.value)}
          placeholder={content.placeholders.acceptance}
          value={state.acceptance}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="demo-bounty">Bounty</Label>
        <div className="flex items-center gap-3">
          <Input
            className="max-w-36"
            disabled={pending}
            id="demo-bounty"
            inputMode="decimal"
            onChange={event => setField("bountyMon", event.target.value)}
            value={state.bountyMon}
          />
          <span className="font-mono text-xs text-[var(--muted-foreground)]">Testnet MON</span>
        </div>
      </div>

      <Button className="w-full" disabled={!ready || pending} type="submit">
        {pending ? (state.txPhase === "signing" ? copy.signing : copy.confirming) : copy.submit}
      </Button>
    </form>
  );
}

function FundedSummary({ flow }: { flow: DemoFlow }) {
  const { state } = flow;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PactStatusStamp state={PACT_STATE.Open} />
        <p className="font-mono text-sm">{state.bountyMon} Testnet MON</p>
      </div>

      <dl className="space-y-3 border-t border-[var(--rule)] pt-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Issue</dt>
          <dd className="mt-1 truncate font-mono text-xs">{state.issueUrl}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Done when</dt>
          <dd className="mt-1">{state.acceptance}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Funding transaction</dt>
          <dd className="mt-1 font-mono text-xs">{state.fundTx}</dd>
        </div>
      </dl>

      <p className="text-sm text-[var(--muted-foreground)]">{copy.fundedNote}</p>
    </div>
  );
}

export function FundPanel({ flow }: { flow: DemoFlow }) {
  const reduced = useReducedMotion();
  const active = flow.activeSide === "fund";
  const showSummary = flow.isFunded;

  const body = showSummary ? <FundedSummary flow={flow} /> : <Form flow={flow} />;

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
        body
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key={showSummary ? "summary" : "form"}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
