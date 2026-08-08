"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ExamplePactCard, PreviewPromptCard } from "~~/components/board/PactCard";
import { TransactionProgress } from "~~/components/ui/ExplorerLink";
import { TestnetNotice } from "~~/components/ui/TestnetNotice";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { demo } from "~~/config/demo";
import { useCreatePact } from "~~/hooks/useCreatePact";
import { defaultDeadlines, fromDatetimeLocalValue, toDatetimeLocalValue } from "~~/lib/format";
import { validateCreateForm } from "~~/lib/validation";

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
      <div className="space-y-4">
        <p>{content.ledgerNotConfigured}</p>
        <ExamplePactCard />
        <PreviewPromptCard />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <TestnetNotice />

      <div className="space-y-2">
        <Label htmlFor="issueUrl">GitHub issue URL</Label>
        <Input
          id="issueUrl"
          placeholder={content.placeholders.issueUrl}
          value={issueUrl}
          onChange={e => setIssueUrl(e.target.value)}
        />
        {fieldErrors.issueUrl && <p className="text-sm text-[var(--danger)]">{fieldErrors.issueUrl}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="acceptance">Acceptance sentence</Label>
        <textarea
          className="mp-input min-h-24 w-full"
          id="acceptance"
          maxLength={140}
          placeholder={content.placeholders.acceptance}
          value={acceptance}
          onChange={e => setAcceptance(e.target.value)}
        />
        <p className="font-mono text-xs">{140 - acceptance.length} characters remaining</p>
        {fieldErrors.acceptance && <p className="text-sm text-[var(--danger)]">{fieldErrors.acceptance}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bountyMon">Testnet bounty (MON)</Label>
        <Input id="bountyMon" inputMode="decimal" value={bountyMon} onChange={e => setBountyMon(e.target.value)} />
        <p className="text-sm text-[var(--muted-foreground)]">Testnet only</p>
        {fieldErrors.bountyMon && <p className="text-sm text-[var(--danger)]">{fieldErrors.bountyMon}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="claimDeadline">Claim deadline</Label>
          <Input
            id="claimDeadline"
            type="datetime-local"
            value={claimDeadline}
            onChange={e => setClaimDeadline(e.target.value)}
          />
          {fieldErrors.claimDeadline && <p className="text-sm text-[var(--danger)]">{fieldErrors.claimDeadline}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="workDeadline">Work deadline</Label>
          <Input
            id="workDeadline"
            type="datetime-local"
            value={workDeadline}
            onChange={e => setWorkDeadline(e.target.value)}
          />
          {fieldErrors.workDeadline && <p className="text-sm text-[var(--danger)]">{fieldErrors.workDeadline}</p>}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="font-mono text-xs uppercase tracking-[0.08em]">Preview</p>
          <p className="mt-2 font-mono text-sm">{issueUrl || content.placeholders.issueUrl}</p>
          <p className="mt-2 text-sm">{acceptance || content.placeholders.acceptance}</p>
          <p className="mt-2 font-mono text-sm">{bountyMon || demo.defaultBountyMon} Testnet MON</p>
        </CardContent>
      </Card>

      {!isConnected ? (
        <WalletGate />
      ) : (
        <Button disabled={isPending} type="submit">
          {isPending ? "Confirm in wallet" : `Lock ${bountyMon} Testnet MON and publish`}
        </Button>
      )}

      <p className="text-sm text-[var(--muted-foreground)]">{content.createDisclaimer}</p>
      <TransactionProgress pending={isPending} txHash={txHash} error={error} />
    </form>
  );
}
