import { content } from "~~/config/content";
import { cn } from "~~/lib/cn";

export function TestnetNotice({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <p className={cn("font-mono text-xs uppercase tracking-[0.08em] text-[var(--ink)]/70", className)}>
        {content.testnetNote}
      </p>
    );
  }

  return (
    <div className="mp-card border-dashed p-4">
      <p className="font-mono text-xs uppercase tracking-[0.08em]">{content.testnetNote}</p>
      <p className="mt-2 text-sm">{content.publicDataWarning}</p>
    </div>
  );
}
