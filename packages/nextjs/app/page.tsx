import { ClosingFork } from "~~/components/landing/ClosingFork";
import { HeroSection } from "~~/components/landing/HeroSection";
import { Limitations } from "~~/components/landing/Limitations";
import { LiveLedger } from "~~/components/landing/LiveLedger";
import { ProblemSplit } from "~~/components/landing/ProblemSplit";
import { TryItSection } from "~~/components/landing/demo/TryItSection";

/**
 * Section order is deliberate: each one answers the question the previous
 * section raises. What is this → why care → how does it work → is anyone
 * using it → what's the catch → what do I do.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSplit />
      <TryItSection />
      <LiveLedger />
      <Limitations />
      <ClosingFork />
    </>
  );
}
