"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { DemoBoard, PactCard } from "~~/components/board/PactCard";
import { TransactionProgress } from "~~/components/ui/ExplorerLink";
import { TestnetNotice } from "~~/components/ui/TestnetNotice";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { FaucetLink, WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { demo } from "~~/config/demo";
import { useCreatePact } from "~~/hooks/useCreatePact";
import { defaultDeadlines, fromDatetimeLocalValue, monToWei, toDatetimeLocalValue } from "~~/lib/format";
import { PACT_STATE, PactData } from "~~/lib/pact";
import { validateCreateForm } from "~~/lib/validation";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

function Fieldset({ legend, hint, children }: { legend: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-[var(--rule)] pt-6">
      <legend className="sr-only">{legend}</legend>
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{legend}</p>
      {hint && <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </fieldset>
  );
}

export function CreatePactForm() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createPact, isPending, txHash, error, isConfigured } = useCreatePact();
  const defaults = defaultDeadlines(demo.claimDeadlineMinutes, demo.workDeadlineMinutes);

  const [issueUrl, setIssueUrl] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [bountyMon, setBountyMon] = useState<string>(demo.defaultBountyMon);
  const [claimDeadline, setClaimDeadline] = useState(toDatetimeLocalValue(defaults.claim));
  const [workDeadline, setWorkDeadline] = useState(toDatetimeLocalValue(defaults.work));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const previewInput = {
    issueUrl,
    acceptance,
    bountyMon,
    claimDeadline: fromDatetimeLocalValue(claimDeadline),
    workDeadline: fromDatetimeLocalValue(workDeadline),
  };

  // Rendered through the real PactCard, so the maintainer sees exactly what a
  // contributor will see on the board rather than an approximation of it.
  let previewBounty = 0n;
  try {
    previewBounty = monToWei(bountyMon || demo.defaultBountyMon);
  } catch {
    previewBounty = 0n;
  }

  const previewPact: PactData = {
    id: 0,
    maintainer: ZERO,
    contributor: ZERO,
    bountyWei: previewBounty,
    claimDeadline: BigInt(Math.floor(previewInput.claimDeadline.getTime() / 1000) || 0),
    workDeadline: BigInt(Math.floor(previewInput.workDeadline.getTime() / 1000) || 0),
    state: PACT_STATE.Open,
    issueUrl: issueUrl || content.placeholders.issueUrl,
    acceptance: acceptance || content.placeholders.acceptance,
    proofUrl: "",
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateCreateForm(previewInput);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const pactId = await createPact(previewInput);
      if (pactId !== undefined) router.push(`/pacts/${pactId}`);
    } catch (e) {
      if (e && typeof e === "object" && "issueUrl" in (e as object)) {
        setFieldErrors(e as Record<string, string>);
      }
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-[var(--muted-foreground)]">{content.ledgerNotConfigured}</p>
        <DemoBoard limit={2} />
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <TestnetNotice />

        <Fieldset hint="Point at one public GitHub issue. Anyone can read this." legend="The issue">
          <div className="space-y-2">
            <Label htmlFor="issueUrl">GitHub issue URL</Label>
            <Input
              aria-describedby="issueUrl-note"
              id="issueUrl"
              placeholder={content.placeholders.issueUrl}
              value={issueUrl}
              onChange={e => setIssueUrl(e.target.value)}
            />
            {/* The warning sits at the field that causes the exposure, not in a wall of text. */}
            <p className="text-xs text-[var(--muted-foreground)]" id="issueUrl-note">
              Public on Monad Testnet. Do not use a private repository link.
            </p>
            {fieldErrors.issueUrl && (
              <p className="text-sm text-[var(--danger)]" role="alert">
                {fieldErrors.issueUrl}
              </p>
            )}
          </div>
        </Fieldset>

        <Fieldset
          hint="One sentence a contributor can check their own work against. This is what you'll review."
          legend="What counts as done"
        >
          <div className="space-y-2">
            <Label htmlFor="acceptance">Acceptance sentence</Label>
            <textarea
              aria-describedby="acceptance-note"
              className="min-h-24 w-full rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 text-sm"
              id="acceptance"
              maxLength={140}
              placeholder={content.placeholders.acceptance}
              value={acceptance}
              onChange={e => setAcceptance(e.target.value)}
            />
            <p className="font-mono text-xs text-[var(--muted-foreground)]" id="acceptance-note">
              {140 - acceptance.length} characters remaining · stored publicly on-chain
            </p>
            {fieldErrors.acceptance && (
              <p className="text-sm text-[var(--danger)]" role="alert">
                {fieldErrors.acceptance}
              </p>
            )}
          </div>
        </Fieldset>

        <Fieldset
          hint="The bounty leaves your wallet now and sits in the contract. You get it back if nobody claims or nobody delivers."
          legend="Bounty and deadlines"
        >
          <div className="space-y-2">
            <Label htmlFor="bountyMon">Testnet bounty (MON)</Label>
            <Input id="bountyMon" inputMode="decimal" value={bountyMon} onChange={e => setBountyMon(e.target.value)} />
            <p className="text-xs text-[var(--muted-foreground)]">
              Testnet MON only, no cash value. <FaucetLink />
            </p>
            {fieldErrors.bountyMon && (
              <p className="text-sm text-[var(--danger)]" role="alert">
                {fieldErrors.bountyMon}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="claimDeadline">Claim deadline</Label>
              <Input
                id="claimDeadline"
                type="datetime-local"
                value={claimDeadline}
                onChange={e => setClaimDeadline(e.target.value)}
              />
              <p className="text-xs text-[var(--muted-foreground)]">Reclaim if nobody has claimed by then.</p>
              {fieldErrors.claimDeadline && (
                <p className="text-sm text-[var(--danger)]" role="alert">
                  {fieldErrors.claimDeadline}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workDeadline">Work deadline</Label>
              <Input
                id="workDeadline"
                type="datetime-local"
                value={workDeadline}
                onChange={e => setWorkDeadline(e.target.value)}
              />
              <p className="text-xs text-[var(--muted-foreground)]">Reclaim if no proof arrives by then.</p>
              {fieldErrors.workDeadline && (
                <p className="text-sm text-[var(--danger)]" role="alert">
                  {fieldErrors.workDeadline}
                </p>
              )}
            </div>
          </div>
        </Fieldset>

        <div className="space-y-4 border-t border-[var(--rule)] pt-6">
          {!isConnected ? (
            <WalletGate />
          ) : (
            <Button disabled={isPending} size="lg" type="submit">
              {isPending ? "Confirm in wallet" : `Lock ${bountyMon} Testnet MON and publish`}
            </Button>
          )}
          <p className="text-sm text-[var(--muted-foreground)]">{content.createDisclaimer}</p>
          <TransactionProgress error={error} pending={isPending} txHash={txHash} />
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          How contributors will see it
        </p>
        <div className="mt-4">
          <PactCard pact={previewPact} />
        </div>
      </aside>
    </div>
  );
}
