"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { TransactionProgress } from "~~/components/ui/ExplorerLink";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { WalletGate } from "~~/components/wallet/WalletGate";
import { content } from "~~/config/content";
import { usePactActions } from "~~/hooks/usePactActions";
import { PACT_STATE, PactData, getWalletRole } from "~~/lib/pact";
import { validateProofUrl } from "~~/lib/validation";

export function ProofForm({ pactId, onSuccess }: { pactId: number; onSuccess: () => void }) {
  const [proofUrl, setProofUrl] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const { submitProof, isPending, txHash, error } = usePactActions(onSuccess);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const err = validateProofUrl(proofUrl);
    setFieldError(err);
    if (err) return;
    await submitProof(pactId, proofUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="text-sm">{content.proofWarning}</p>
          <div className="space-y-2">
            <Label htmlFor="proofUrl">Public proof URL</Label>
            <Input
              id="proofUrl"
              placeholder="https://github.com/org/repo/pull/1"
              value={proofUrl}
              onChange={e => setProofUrl(e.target.value)}
            />
            {fieldError && <p className="text-sm text-[var(--danger)]">{fieldError}</p>}
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? "Confirm in wallet" : "Submit proof"}
          </Button>
          <TransactionProgress pending={isPending} txHash={txHash} error={error} />
        </CardContent>
      </Card>
    </form>
  );
}

export function RoleActionPanel({ pact, onSuccess }: { pact: PactData; onSuccess: () => void }) {
  const { address, isConnected } = useAccount();
  const role = getWalletRole(address as `0x${string}` | undefined, pact);
  const { claimPact, approveAndRelease, cancelPact, reclaimUnclaimed, reclaimUnsubmitted, isPending, txHash, error } =
    usePactActions(onSuccess);

  const now = BigInt(Math.floor(Date.now() / 1000));
  const claimExpired = now >= pact.claimDeadline;
  const workExpired = now >= pact.workDeadline;

  let title = "";
  let body = "";
  let action: React.ReactNode = null;

  if (!isConnected) {
    title = "Connect to take action";
    body =
      pact.state === PACT_STATE.Open
        ? "Funded by a maintainer. Review the issue before claiming."
        : "Connect a wallet to take action.";
    action = <WalletGate />;
  } else {
    switch (pact.state) {
      case PACT_STATE.Open:
        if (role === "maintainer") {
          title = claimExpired ? "No contributor claimed before deadline." : "No contributor has claimed this commit.";
          body = claimExpired ? "You can reclaim the unclaimed bounty." : "Share this page with a contributor.";
          action = claimExpired ? (
            <Button disabled={isPending} onClick={() => reclaimUnclaimed(pact.id)} type="button">
              Reclaim unclaimed bounty
            </Button>
          ) : (
            <Button disabled={isPending} onClick={() => cancelPact(pact.id)} type="button" variant="secondary">
              Cancel commit
            </Button>
          );
        } else {
          title = "Ready to take this on?";
          body = "Review the GitHub issue, then claim this funded commit.";
          action = (
            <Button disabled={isPending || claimExpired} onClick={() => claimPact(pact.id)} type="button">
              Claim this commit
            </Button>
          );
        }
        break;
      case PACT_STATE.Claimed:
        if (role === "contributor") {
          title = "You own this commit.";
          body = "Submit a public proof when ready.";
          action = workExpired ? null : <ProofForm pactId={pact.id} onSuccess={onSuccess} />;
        } else if (role === "maintainer") {
          title = "Contributor is working.";
          body = `Work deadline is ${new Date(Number(pact.workDeadline) * 1000).toLocaleString()}.`;
          if (workExpired) {
            action = (
              <Button disabled={isPending} onClick={() => reclaimUnsubmitted(pact.id)} type="button">
                Reclaim unsubmitted bounty
              </Button>
            );
          }
        } else {
          title = "This commit is already claimed.";
          body = workExpired
            ? "The work deadline has passed. The maintainer can reclaim the bounty."
            : `A contributor is working on it. Proof is due by ${new Date(
                Number(pact.workDeadline) * 1000,
              ).toLocaleString()}.`;
        }
        break;
      case PACT_STATE.Submitted:
        if (role === "contributor") {
          title = "Proof recorded.";
          body = "Waiting for maintainer review.";
          action = pact.proofUrl ? (
            <Button asChild variant="secondary">
              <a href={pact.proofUrl} rel="noreferrer" target="_blank">
                Open proof
              </a>
            </Button>
          ) : null;
        } else if (role === "maintainer") {
          title = "Review on GitHub, then release.";
          body = "Release if the proof meets the acceptance sentence.";
          action = (
            <div className="flex flex-wrap gap-3">
              {pact.proofUrl && (
                <Button asChild variant="secondary">
                  <a href={pact.proofUrl} rel="noreferrer" target="_blank">
                    Open proof
                  </a>
                </Button>
              )}
              <Button disabled={isPending} onClick={() => approveAndRelease(pact.id)} type="button">
                Approve and release
              </Button>
            </div>
          );
        } else {
          title = "Proof submitted, awaiting review.";
          body = "The maintainer reviews on GitHub and releases the bounty if it meets the acceptance sentence.";
          action = pact.proofUrl ? (
            <Button asChild variant="secondary">
              <a href={pact.proofUrl} rel="noreferrer" target="_blank">
                Open proof
              </a>
            </Button>
          ) : null;
        }
        break;
      case PACT_STATE.Released:
        title = "Pact completed.";
        body = "Testnet bounty released to the contributor.";
        break;
      case PACT_STATE.Cancelled:
      case PACT_STATE.Reclaimed:
        title = "Terminal record.";
        body = "This commit cannot be changed.";
        break;
    }
  }

  const ROLE_LABEL: Record<typeof role, string> = {
    none: "Viewing as a visitor",
    maintainer: "You are the maintainer of this commit",
    contributor: "You are the assigned contributor",
    other: "Viewing as a visitor",
  };

  return (
    <Card className="border-[var(--action)] bg-[rgba(10,147,150,0.12)]">
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{ROLE_LABEL[role]}</p>
        <h2 className="mt-2 text-xl font-medium">{title}</h2>
        {body && <p className="mt-2 text-sm">{body}</p>}
        {action && <div className="mt-4">{action}</div>}
        <TransactionProgress className="mt-4" error={error} pending={isPending} txHash={txHash} />
      </CardContent>
    </Card>
  );
}
