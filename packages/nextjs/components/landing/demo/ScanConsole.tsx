"use client";

import { ScanLine } from "./demoData";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

const copy = content.demo.scan;

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      className="block size-3 rounded-full border border-[var(--action-tint)] border-t-transparent"
      transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
    />
  );
}

function Check() {
  return (
    <svg aria-hidden="true" className="size-3 text-[var(--confirmed)]" fill="none" viewBox="0 0 12 12">
      <path
        d="M2 6.5 4.8 9 10 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * The simulated AI review. Lines are built from whatever the reader typed, so
 * it reads as if something really went and looked at their link.
 */
export function ScanConsole({ lines, step, done }: { lines: ScanLine[]; step: number; done: boolean }) {
  const reduced = useReducedMotion();
  const percent = Math.round((Math.min(step, lines.length) / lines.length) * 100);
  // Lines already finished, plus the one currently spinning.
  const visible = lines.slice(0, Math.min(step + 1, lines.length));

  return (
    <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{copy.title}</p>
        <p className="font-mono text-xs text-[var(--muted-foreground)]">{percent}%</p>
      </div>

      <div
        aria-label={copy.running}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]"
        role="progressbar"
      >
        <motion.div
          animate={{ width: `${percent}%` }}
          className="h-full rounded-full bg-[var(--action)]"
          initial={{ width: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <ol aria-live="polite" className="mt-4 space-y-2 font-mono text-xs">
        {visible.map((line, index) => {
          const complete = index < step;
          return (
            <motion.li
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-2.5"
              initial={reduced ? false : { opacity: 0, x: -6 }}
              key={line.label}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span className="flex size-3 shrink-0 translate-y-0.5 items-center justify-center">
                {complete ? <Check /> : <Spinner />}
              </span>
              <span className={cn("flex-1", complete ? "text-[var(--ink)]" : "text-[var(--muted-foreground)]")}>
                {line.label}
              </span>
              {complete && <span className="shrink-0 text-[var(--muted-foreground)]">{line.result}</span>}
            </motion.li>
          );
        })}
      </ol>

      {done && (
        <motion.div
          animate={reduced ? undefined : { scale: [0.85, 1.06, 1], opacity: 1 }}
          className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--rule)] pt-4"
          initial={reduced ? false : { scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-transparent bg-[var(--confirmed)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--on-dark)]">
            {copy.verdict}
          </span>
          <p className="flex-1 text-xs text-[var(--muted-foreground)]">{copy.verdictNote}</p>
        </motion.div>
      )}
    </div>
  );
}
