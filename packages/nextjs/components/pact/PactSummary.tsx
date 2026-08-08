import { PactStatusStamp } from "~~/components/pact/PactStatusStamp";
import { ExplorerLink } from "~~/components/ui/ExplorerLink";
import { Card, CardContent } from "~~/components/ui/card";
import { getMergePactContractAddress } from "~~/lib/contract";
import { formatDeadline, formatMon, shortenAddress } from "~~/lib/format";
import { MONAD_TESTNET_CHAIN_ID } from "~~/lib/monad";
import { PactData } from "~~/lib/pact";
import { parseIssuePath } from "~~/lib/validation";

export function PactSummary({ pact }: { pact: PactData }) {
  return (
    <Card>
      <CardContent className="p-6">
        <PactStatusStamp state={pact.state} large />
        <h1 className="mt-4 text-2xl font-semibold">{parseIssuePath(pact.issueUrl)}</h1>
        <a className="link mt-2 inline-block font-mono text-sm" href={pact.issueUrl} rel="noreferrer" target="_blank">
          {pact.issueUrl}
        </a>
        <p className="mt-4 text-base">{pact.acceptance}</p>
        <dl className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-2">
          <div>
            <dt className="uppercase tracking-[0.08em] opacity-70">Bounty</dt>
            <dd className="mt-1">{formatMon(pact.bountyWei)} Testnet MON</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.08em] opacity-70">Claim deadline</dt>
            <dd className="mt-1">{formatDeadline(pact.claimDeadline)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.08em] opacity-70">Work deadline</dt>
            <dd className="mt-1">{formatDeadline(pact.workDeadline)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.08em] opacity-70">Maintainer</dt>
            <dd className="mt-1">{shortenAddress(pact.maintainer)}</dd>
          </div>
        </dl>
        {pact.proofUrl && (
          <div className="mt-4">
            <p className="font-mono text-xs uppercase tracking-[0.08em]">Proof</p>
            <a
              className="link mt-1 inline-block font-mono text-sm"
              href={pact.proofUrl}
              rel="noreferrer"
              target="_blank"
            >
              {pact.proofUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LedgerDisclosure({ pact }: { pact: PactData }) {
  const contractAddress = getMergePactContractAddress(MONAD_TESTNET_CHAIN_ID);
  return (
    <details className="mp-card p-4">
      <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.08em]">Ledger record</summary>
      <dl className="mt-4 space-y-2 font-mono text-xs">
        <div>
          <dt className="opacity-70">Pact ID</dt>
          <dd>{pact.id}</dd>
        </div>
        <div>
          <dt className="opacity-70">Contract</dt>
          <dd>{contractAddress ? shortenAddress(contractAddress, 6) : "Not configured"}</dd>
        </div>
        {contractAddress && <ExplorerLink href={`/address/${contractAddress}`} label="View contract on MonadVision" />}
      </dl>
    </details>
  );
}
