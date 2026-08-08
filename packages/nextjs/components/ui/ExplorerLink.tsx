import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { EXPLORER_URL } from "~~/lib/monad";

export function ExplorerLink({ href, label }: { href: string; label: string }) {
  const url = href.startsWith("http") ? href : `${EXPLORER_URL}${href}`;
  return (
    <a className="link inline-flex items-center gap-1 font-mono text-sm" href={url} rel="noreferrer" target="_blank">
      {label}
      <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden />
    </a>
  );
}

export function TransactionProgress({
  pending,
  txHash,
  error,
  pendingLabel = "Confirm in wallet…",
  submittedLabel = "Writing to Monad Testnet…",
}: {
  pending?: boolean;
  txHash?: string;
  error?: string | null;
  pendingLabel?: string;
  submittedLabel?: string;
}) {
  if (error) {
    return <p className="text-sm text-[var(--danger)]">{error}</p>;
  }
  if (!pending && !txHash) return null;
  return (
    <div className="font-mono text-sm">
      <p>{txHash ? submittedLabel : pendingLabel}</p>
      {txHash && <ExplorerLink href={`/tx/${txHash}`} label={txHash.slice(0, 10) + "…"} />}
    </div>
  );
}
