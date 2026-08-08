import { ArrowTopRightOnSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "~~/lib/cn";
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
  className,
  pendingLabel = "Confirm in wallet…",
  submittedLabel = "Writing to Monad Testnet…",
  confirmedLabel = "Confirmed on Monad Testnet",
}: {
  pending?: boolean;
  txHash?: string;
  error?: string | null;
  className?: string;
  pendingLabel?: string;
  submittedLabel?: string;
  confirmedLabel?: string;
}) {
  if (error) {
    return (
      <p className={cn("text-sm text-[var(--danger)]", className)} role="alert">
        {error}
      </p>
    );
  }
  if (!pending && !txHash) return null;

  // Three distinct phases. The confirmed case used to be missing entirely, so a
  // mined transaction kept claiming it was still being written.
  const confirmed = Boolean(txHash) && !pending;
  const label = confirmed ? confirmedLabel : txHash ? submittedLabel : pendingLabel;

  return (
    <div aria-live="polite" className={cn("font-mono text-sm", className)}>
      <p className={cn("flex items-center gap-2", confirmed && "font-medium")}>
        {confirmed && <CheckCircleIcon aria-hidden className="h-4 w-4 shrink-0 text-[var(--action)]" />}
        {label}
      </p>
      {txHash && <ExplorerLink href={`/tx/${txHash}`} label={txHash.slice(0, 10) + "…"} />}
    </div>
  );
}
