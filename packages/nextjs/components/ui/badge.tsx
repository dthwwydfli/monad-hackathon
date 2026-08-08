import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors",
  {
    variants: {
      variant: {
        open: "border-[var(--action)] bg-[var(--paper)] text-[var(--ink)]",
        claimed: "border-transparent bg-[var(--ink)] text-[var(--paper)]",
        submitted: "border-transparent bg-[var(--review)] text-[var(--ink)]",
        released: "border-transparent bg-[var(--confirmed)] text-[var(--ink)]",
        neutral: "border-[var(--rule)] bg-transparent text-[var(--ink)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
