import Link from "next/link";
import { Button } from "~~/components/ui/button";
import { FaucetLink } from "~~/components/wallet/WalletGate";

/**
 * The only place on the page where both CTAs sit side by side. By this point
 * the reader knows which side of the market they are on, so the fork costs
 * nothing — offering it in the hero would have split attention instead.
 */
export function ClosingFork() {
  return (
    <section className="border-t border-[var(--rule)] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col items-start">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              You have an issue to fund
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight">Lock a bounty against it.</h2>
            <p className="mt-3 flex-1 text-[var(--muted-foreground)]">
              Write one sentence for what done looks like, set two deadlines, and publish. The bounty stays yours until
              you release it.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/create">Fund an issue</Link>
            </Button>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              You want to pick up work
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight">Find something already funded.</h2>
            <p className="mt-3 flex-1 text-[var(--muted-foreground)]">
              Every open issue on the board already has its bounty locked. Check the balance before you claim.
            </p>
            <Button asChild className="mt-6" size="lg" variant="secondary">
              <Link href="/pacts">Browse open commits</Link>
            </Button>
          </div>
        </div>

        <p className="mt-12 border-t border-[var(--rule)] pt-6 text-sm text-[var(--muted-foreground)]">
          Need Testnet MON to try either path? <FaucetLink />
        </p>
      </div>
    </section>
  );
}
