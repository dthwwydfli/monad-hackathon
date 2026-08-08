"use client";

import Link from "next/link";
import { ExamplePactCard, PactCard, PactCardSkeleton, PreviewPromptCard } from "~~/components/board/PactCard";
import { StatStrip } from "~~/components/board/StatStrip";
import { HeroSection } from "~~/components/landing/HeroSection";
import { Button } from "~~/components/ui/button";
import { content } from "~~/config/content";
import { demo } from "~~/config/demo";
import { usePacts } from "~~/hooks/usePacts";
import { PACT_STATE } from "~~/lib/pact";

export default function HomePage() {
  const { pacts, isLoading, isConfigured, refreshing } = usePacts(demo.landingPreviewCount);
  const preview = pacts.slice(0, demo.landingPreviewCount);

  const counts = {
    open: pacts.filter(p => p.state === PACT_STATE.Open).length,
    claimed: pacts.filter(p => p.state === PACT_STATE.Claimed).length,
    review: pacts.filter(p => p.state === PACT_STATE.Submitted).length,
    released: pacts.filter(p => p.state === PACT_STATE.Released).length,
  };

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-[1180px] px-5 py-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-mono text-sm uppercase tracking-[0.08em]">Live ledger</h2>
          {refreshing && <span className="text-sm">Refreshing ledger…</span>}
        </div>

        {!isConfigured ? (
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase">{content.exampleLedger}</p>
            <ExamplePactCard />
            <PreviewPromptCard />
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <StatStrip counts={{ open: 0, claimed: 0, review: 0, released: 0 }} />
            <PactCardSkeleton />
            <PactCardSkeleton />
          </div>
        ) : preview.length === 0 ? (
          <div className="space-y-4">
            <PreviewPromptCard />
            <Button asChild>
              <Link href="/create">Fund a pact</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <StatStrip counts={counts} />
            <p className="text-sm">{content.showingLatest}</p>
            <div className="grid gap-4">
              {preview.map(pact => (
                <PactCard key={pact.id} pact={pact} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
