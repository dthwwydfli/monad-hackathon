import { content } from "~~/config/content";

/**
 * Names the fear on each side of the market before offering the mechanism.
 * The two sides are deliberately symmetrical — neither reads as the primary
 * customer, because at this stage the page does not yet know which one you are.
 */
const SIDES = [
  {
    who: "If you maintain the repo",
    fear: "You pay for work that never lands.",
    answer:
      "Nothing leaves your wallet until you release it. If nobody claims, or the deadline passes with no proof, you get the bounty back.",
  },
  {
    who: "If you write the code",
    fear: "You do the work and the bounty turns out to be fake.",
    answer: "The bounty is locked before you claim. You can check the balance yourself before writing a line.",
  },
];

export function ProblemSplit() {
  return (
    <section className="border-t border-[var(--rule)] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Why this exists</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">{content.headline}</h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {SIDES.map(side => (
            <div className="border-t-2 border-[var(--ink)]/25 pt-6" key={side.who}>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{side.who}</p>
              <h3 className="mt-3 text-xl font-medium leading-snug">{side.fear}</h3>
              <p className="mt-3 text-[var(--muted-foreground)]">{side.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-2xl border-l-2 border-[var(--action)] pl-5 text-[var(--muted-foreground)]">
          {content.howItWorks.githubNote}
        </p>
      </div>
    </section>
  );
}
