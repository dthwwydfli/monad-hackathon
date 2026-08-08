import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~~/components/ui/accordion";
import { content } from "~~/config/content";

const NOT = [
  {
    title: "Doesn't read your code",
    body: "You review the fix on GitHub. commit only records who funded what and whether payment happened.",
  },
  { title: "Not an arbitrator", body: "There is no dispute resolution. Both sides accept that going in." },
  { title: "Not a legal agreement", body: "A commit is a public record of intent, not an enforceable contract." },
  { title: "Not real money", body: content.testnetNote },
];

/**
 * Stated plainly and early. For a technical reader, naming the limits is a
 * stronger trust signal than another feature claim would be. The list collapses
 * so the page reads as four short admissions rather than a wall of caveats.
 */
export function Limitations() {
  return (
    <section className="border-t border-[var(--rule)] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">What commit is not</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">
          The boring parts, stated up front.
        </h2>

        <Accordion
          className="mt-10 max-w-3xl border-t border-[var(--rule)]"
          collapsible
          defaultValue={NOT[0].title}
          type="single"
        >
          {NOT.map(item => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-10 max-w-3xl text-sm text-[var(--muted-foreground)]">{content.howItWorks.limitation}</p>
      </div>
    </section>
  );
}
