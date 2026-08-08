"use client";

import { DEMO_CONFIDENCE } from "./demoData";
import { DemoFlow } from "./useDemoFlow";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "~~/config/content";

const copy = content.demo.receipt;

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-[var(--muted-foreground)]">{label}</dt>
      <dd className={mono ? "truncate font-mono text-[11px]" : "truncate text-right"}>{value}</dd>
    </div>
  );
}

export function PayoutReceipt({ flow }: { flow: DemoFlow }) {
  const reduced = useReducedMotion();
  const { state, maintainer, contributor } = flow;

  const body = (
    <div className="rounded-xl border border-[var(--confirmed)] bg-[rgba(148,210,189,0.08)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{copy.title}</p>
        <p className="font-mono text-lg">
          {state.bountyMon} <span className="text-xs text-[var(--muted-foreground)]">Testnet MON</span>
        </p>
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-[var(--rule)] pt-4 text-xs">
        <Row label={copy.from} mono value={maintainer} />
        <Row label={copy.to} mono value={contributor ?? "—"} />
        <Row label={copy.issue} mono value={state.issueUrl} />
        <Row label={copy.proof} mono value={state.proofUrl} />
        <Row label={copy.verdict} value={content.demo.scan.verdict} />
        <Row label={copy.confidence} mono value={DEMO_CONFIDENCE} />
        <Row label={copy.tx} mono value={state.releaseTx ?? "—"} />
        <Row label={copy.settled} value={state.settledAt ?? "—"} />
      </dl>

      <p className="mt-4 border-t border-[var(--rule)] pt-3 text-xs text-[var(--muted-foreground)]">
        {content.testnetNote}
      </p>
    </div>
  );

  if (reduced) return body;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {body}
    </motion.div>
  );
}
