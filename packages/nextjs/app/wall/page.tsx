"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LedgerBackground } from "~~/components/background/LedgerBackground";
import { DemoBoard } from "~~/components/board/PactCard";
import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { BorderBeam } from "~~/components/ui/border-beam";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { NumberTicker } from "~~/components/ui/number-ticker";
import { usePactPulse } from "~~/hooks/usePactPulse";
import { formatMon } from "~~/lib/format";
import { STATUS_LABELS } from "~~/lib/pact";
import { parseIssuePath } from "~~/lib/validation";

export default function WallPage() {
  const { pacts, releasedCount, pulseEvents, refreshing, isConfigured } = usePactPulse();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "f") setFullscreen(current => !current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`relative ${fullscreen ? "fixed inset-0 z-50" : "min-h-screen"} p-6 md:p-10`}>
      <LedgerBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            {/* Lowercase lockup, not an eyebrow — the uppercase treatment used
                elsewhere would spell the wordmark wrong. */}
            <p className="text-sm font-semibold tracking-[0.14em]">commit / live ledger</p>
            {refreshing && <p className="mt-2 text-sm">Refreshing ledger…</p>}
          </div>
          <Button onClick={() => setFullscreen(v => !v)} type="button" variant="secondary">
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            {!isConfigured || pacts.length === 0 ? (
              <DemoBoard limit={4} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pacts.map((pact, i) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 12 }}
                    key={pact.id}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Card className="mp-card-hover h-full transition-all duration-200">
                      <CardContent className="p-5">
                        <PactStatusStamp state={pact.state} large />
                        <p className="mt-4 font-mono text-lg">{parseIssuePath(pact.issueUrl)}</p>
                        <p className="mt-2 text-2xl font-semibold">{formatMon(pact.bountyWei)} MON</p>
                        <p className="mt-2 text-sm">{STATUS_LABELS[pact.state].shortLabel}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* The one number a room full of people is watching, so it gets the
                only moving border on the page. */}
            <Card className="relative overflow-hidden text-center">
              <BorderBeam duration={10} size={80} />
              <CardContent className="p-6">
                <NumberTicker className="text-6xl font-medium" value={releasedCount} />
                <p className="mt-2 text-xl">Testnet bounties released</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em]">Activity pulse</p>
                <ul className="mt-4 space-y-3 text-base">
                  {pulseEvents.length === 0 && (
                    <li className="text-sm text-[var(--muted-foreground)]">Waiting for the first commit…</li>
                  )}
                  {pulseEvents.map(event => (
                    <motion.li
                      animate={{ opacity: 1, x: 0 }}
                      className="border-l-2 border-[var(--confirmed)] pl-3"
                      initial={{ opacity: 0, x: -8 }}
                      key={event.id}
                      transition={{ duration: 0.45 }}
                    >
                      {event.message}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/pacts">Open the commit board</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
