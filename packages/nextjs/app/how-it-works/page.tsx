import Link from "next/link";
import { LifecycleWalkthrough } from "~~/components/landing/LifecycleWalkthrough";
import { TryItSection } from "~~/components/landing/demo/TryItSection";
import { Button } from "~~/components/ui/button";
import { Card, CardContent } from "~~/components/ui/card";
import { content } from "~~/config/content";

export default function HowItWorksPage() {
  return (
    <div>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-medium">How it works</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Four steps from funded issue to released bounty — all on Monad Testnet. Play both sides below, then read the
          real rules underneath.
        </p>
      </div>

      <div className="mt-10">
        <TryItSection contained={false} id="try-it" />
      </div>

      <div className="max-w-3xl border-t border-[var(--rule)] pt-12">
        <h2 className="text-2xl font-medium">The four steps, for real</h2>

        <ol className="relative mt-8 space-y-0">
          {content.howItWorks.steps.map((step, index) => (
            <li className="relative flex gap-6 pb-10 last:pb-0" key={step.title}>
              {index < content.howItWorks.steps.length - 1 && (
                <div className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5 bg-[var(--rule)]" />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--action)] bg-[var(--paper)] font-mono text-sm font-semibold">
                {index + 1}
              </div>
              <Card className="flex-1">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    Step {index + 1} · {step.actor}
                  </p>
                  <h3 className="mt-2 text-xl font-medium">{step.title}</h3>
                  <p className="mt-2">{step.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <blockquote className="mt-8 rounded-lg border-l-4 border-[var(--action)] bg-[rgba(10,147,150,0.14)] p-6 italic">
          {content.howItWorks.githubNote}
        </blockquote>
        <p className="mt-6 text-sm text-[var(--muted-foreground)]">{content.howItWorks.limitation}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/create">Fund an issue</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/preview">View product preview</Link>
          </Button>
        </div>
      </div>

      <LifecycleWalkthrough id="lifecycle" />
    </div>
  );
}
