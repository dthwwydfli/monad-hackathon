"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LedgerBackground } from "~~/components/background/LedgerBackground";
import { StatStrip } from "~~/components/board/StatStrip";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Separator } from "~~/components/ui/separator";
import { content } from "~~/config/content";
import { MOCK_DETAIL, MOCK_PACTS, MOCK_PULSE, MOCK_SUMMARY, MOCK_TIMELINE, MockPact } from "~~/config/mockups";
import { parseIssuePath } from "~~/lib/validation";

function MockPactCard({ pact }: { pact: MockPact }) {
  return (
    <Card className="mp-card-hover transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <PactStatusStamp state={pact.state} />
          <p className="font-mono text-xs">{pact.bountyMon} Testnet MON</p>
        </div>
        <h3 className="mt-3 font-mono text-sm">{parseIssuePath(pact.issueUrl)}</h3>
        <p className="mt-2 line-clamp-2 text-sm">{pact.acceptance}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span>Claim by {pact.claimDeadline}</span>
          <span>Maintainer {pact.maintainer}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PreviewPage() {
  return (
    <div className="relative -mx-5 -mt-8">
      <LedgerBackground />
      <div className="relative z-10 space-y-12 px-5 py-8">
        <div className="preview-banner" role="status">
          <strong>Product preview</strong> — illustrative mockups only, not live Monad data.
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.14em]">{content.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight md:text-5xl">{content.headline}</h1>
            <p className="mt-4 max-w-xl text-lg">{content.body}</p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              This page shows what a populated board looks like. Live routes read the contract only.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/create">Fund an issue</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pacts">Browse live board</Link>
              </Button>
            </div>
          </div>

          <div>
            <StatStrip counts={MOCK_SUMMARY} animated />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Mock ledger snapshot
            </p>
            <div className="mt-4 grid gap-4">
              {MOCK_PACTS.slice(0, 3).map(pact => (
                <MockPactCard key={pact.id} pact={pact} />
              ))}
            </div>
          </div>
        </motion.section>

        <section>
          <h2 className="text-2xl font-medium">Full lifecycle board</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Six mock commits covering every state from open to cancelled.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PACTS.map(pact => (
              <MockPactCard key={pact.id} pact={pact} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-medium">Lifecycle timeline</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Funded → claimed → proof → released walkthrough for commit #105.
          </p>
          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max gap-0">
              {MOCK_TIMELINE.map((item, i) => (
                <div className="flex items-start" key={item.step}>
                  <div className="flex w-44 flex-col items-center px-2 text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold ${item.active ? "border-[var(--action)] bg-[var(--action)] text-[var(--on-dark)]" : "border-[var(--rule)]"}`}
                    >
                      {i + 1}
                    </div>
                    <p className="mt-3 font-semibold">{item.step}</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="mt-2 font-mono text-xs">{item.timestamp}</p>
                  </div>
                  {i < MOCK_TIMELINE.length - 1 && <div className="mt-5 h-0.5 w-8 bg-[var(--action)] opacity-40" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail view — awaiting review</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Static role-action UI. No wallet writes on this page.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PactStatusStamp state={MOCK_DETAIL.state} large />
              <h3 className="font-mono text-lg">{parseIssuePath(MOCK_DETAIL.issueUrl)}</h3>
              <p>{MOCK_DETAIL.acceptance}</p>
              <Separator />
              <dl className="grid gap-3 font-mono text-sm sm:grid-cols-2">
                <div>
                  <dt className="uppercase tracking-[0.08em] opacity-70">Bounty</dt>
                  <dd className="mt-1">{MOCK_DETAIL.bountyMon} Testnet MON</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.08em] opacity-70">Contributor</dt>
                  <dd className="mt-1">{MOCK_DETAIL.contributor}</dd>
                </div>
              </dl>
              {MOCK_DETAIL.proofUrl && (
                <p className="font-mono text-sm">
                  Proof:{" "}
                  <a className="link" href={MOCK_DETAIL.proofUrl}>
                    {MOCK_DETAIL.proofUrl}
                  </a>
                </p>
              )}
              <div className="rounded-lg border border-[var(--rule)] bg-[rgba(10,147,150,0.14)] p-4">
                <p className="font-semibold">Review on GitHub, then release.</p>
                <p className="mt-1 text-sm">Release if the proof meets the acceptance sentence.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="secondary" disabled>
                    Open proof
                  </Button>
                  <Button disabled>Approve and release</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-6xl font-semibold">{MOCK_SUMMARY.released}</p>
                <p className="mt-2 text-xl">Testnet bounties released</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-[0.14em]">Activity pulse</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {MOCK_PULSE.map(event => (
                    <li className="border-l-2 border-[var(--confirmed)] pl-3" key={event.id}>
                      <span>{event.message}</span>
                      <span className="ml-2 font-mono text-xs text-[var(--muted-foreground)]">{event.timestamp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
