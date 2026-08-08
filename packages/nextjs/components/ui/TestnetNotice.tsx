import { content } from "~~/config/content";

export function TestnetNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--ink)]/70">{content.testnetNote}</p>;
  }

  return (
    <div className="mp-card border-dashed p-4">
      <p className="font-mono text-xs uppercase tracking-[0.08em]">{content.testnetNote}</p>
      <p className="mt-2 text-sm">{content.publicDataWarning}</p>
    </div>
  );
}
